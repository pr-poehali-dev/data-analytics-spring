"""Получение списка заявок для страницы администратора MagicShine"""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    req_headers = event.get('headers') or {}
    password = req_headers.get('X-Admin-Password', '')
    if password != os.environ.get('ADMIN_PASSWORD', ''):
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверный пароль'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, phone, service, salon, comment, created_at FROM bookings ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    bookings = [
        {
            'id': r[0],
            'name': r[1],
            'phone': r[2],
            'service': r[3],
            'salon': r[4],
            'comment': r[5],
            'created_at': r[6].strftime('%d.%m.%Y %H:%M') if r[6] else '',
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'bookings': bookings}, ensure_ascii=False),
    }
