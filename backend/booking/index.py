"""Сохранение заявки на запись в салон MagicShine"""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    service = body.get('service', '').strip()
    salon = body.get('salon', '').strip()
    comment = body.get('comment', '').strip()

    if not name or not phone or not service or not salon:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все обязательные поля'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO bookings (name, phone, service, salon, comment) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (name, phone, service, salon, comment)
    )
    booking_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True, 'id': booking_id, 'message': 'Заявка успешно отправлена!'})
    }
