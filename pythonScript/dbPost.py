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
    conn = sqlite3.connect("RANK.db")
    with conn:
        #   generating a cursor from connection
        cursor = conn.cursor()
        data = (
            ('One', 1, 'Seoul'),
            ('Two', 2, 'Suwon'),
            ('Three', 3, 'Daegu')
        )
        sql = "insert into RANK(name,score,tile_score) values (?,?,?)"
        #cursor.executemany(sql, data)    
        cursor.execute(sql,(name,score,tile_score))
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
            result.append(list(row))
        result = sorted(result, key=lambda score: score[2], reverse=True)
        if len(result)>=10:
            result[-1][0] = name
            result[-1][1] = int(score)
            result[-1][2] = int(tile_score)
        else:
            result.append(list([len(result)+1, name, int(score), int(tile_score)]))
            sql = "insert into RANK(name,score,tile_score) values (?,?,?)"
            cursor.execute(sql,(result[-1][1],result[-1][2],result[-1][3]))
            conn.commit()
            

        # data = (
        #     ('One', 1, 'Seoul'),
        #     ('Two', 2, 'Suwon'),
        #     ('Three', 3, 'Daegu')
        # )
        # sql = "insert into RANK(name,score,tile_score) values (?,?,?)"
        # #cursor.executemany(sql, data)    
        # cursor.execute(sql,(name,score,tile_score))
        # conn.commit()

def main(arg):
    name, score, tile_score = arg[:]
    insert(name, score, tile_score)

if __name__ == '__main__':
    main(sys.argv[1:])
