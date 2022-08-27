import sqlite3
import sys
import json

def main(search, data):
    ans = []
    print(json.dumps(data))
    for word in data:
        if search in word:
            ans.append(word)
            # print(json.dumps(word))
    # print(json.dumps(data))
    # print(json.dumps(ans))
    # print(ans)
    # #comparing with the db file
    # for row in data:
    #     for word in row:
    #         if word != last_answer and arg == word[:len(arg)].strip().lower():
    #             results["country"].append(word)
    #             last_answer = word
    # return_value = json.dumps(results)
    # print(return_value)

if __name__ == '__main__':
    search, data = sys.argv[1:]
    # search = 'f'
    # data = [
    #     'test',
    #     '1',
    #     'test',
    #     'ff',
    #     'working good? edit good?',
    #     'this is a titl5555',
    #     'helloooo',
    #     'wefewf',
    #     'another one from user five',
    #     'title from user five',
    #     'this is a title5',
    #     'this is a title6',
    #     'this is a title4',
    #     'this is a title445',
    #     'this is a title23',
    #     'first'
    # ]
    main(search, data)
    