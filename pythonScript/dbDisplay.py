import sqlite3
import sys
import json

def delete(id):
    conn = sqlite3.connect("RANK.db")
    with conn:
        cursor = conn.cursor()
        sql = 'DELETE FROM customer WHERE id=?'
        cursor.execute(sql,(id,))
        conn.commit()

def show():
    conn = sqlite3.connect("RANK.db")
    with conn:
        result = []
        #   generating a cursor from connection
        cursor = conn.cursor()
        cursor.execute('select * from RANK')
        # Data fetch and printing out
        rows = cursor.fetchall()
        for row in rows:
            result.append(row)
            #print(row)
        return_value = json.dumps(result)
        print(return_value)


def dbShow():
    #   SQLite DB connection
    conn = sqlite3.connect("./pythonScript/RANK.db")
    with conn:
        result = []
        # generating a cursor from connection
        cursor = conn.cursor()
        cursor.execute("select * from RANK")
        # Data fetch and printing out
        rows = cursor.fetchall()
        for row in rows:
            result.append(row)
        repeat = 10-len(result)
        for i in range(repeat):
            result.append(['','','',''])
        return_value = json.dumps(result)
        print(return_value)


def main():
    dbShow()

if __name__ == '__main__':
    main()
