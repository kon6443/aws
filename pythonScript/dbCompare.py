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

def insert(name, score, tile_score):
    #   SQLite DB connection
    conn = sqlite3.connect("./pythonScript/RANK.db")
    with conn:
        result = []
        #   generating a cursor from connection
        cursor = conn.cursor()
        cursor.execute("select * from RANK")
        # Data fetch and printing out
        rows = cursor.fetchall()
        for row in rows:
            result.append(row)



        data = (
            ('One', 1, 'Seoul'),
            ('Two', 2, 'Suwon'),
            ('Three', 3, 'Daegu')
        )
        sql = "insert into RANK(name,score,tile_score) values (?,?,?)"
        #cursor.executemany(sql, data)    
        cursor.execute(sql,(name,score,tile_score))
        conn.commit()

def compare(score):
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
        if int(score)>int(result[-1][2]):
            # return_value = json.dumps(result)
            print('True')
        else:
            print('False')
            


def main(arg):
    score = arg[:]
    compare(score[0])

if __name__ == '__main__':
    main(sys.argv[1:])
