import pandas as pd
import json
import os
import mysql.connector as mysql
from mysql.connector import Error

TRAINEE = "trainee.sql"

cwd = os.getcwd()

def DBConnect(dbName=None):
    """
    A simple function which connects to the local database reutrning the connection and cursor of the database
    Parameters
    ----------
    dbName :
        Default value = None

    Returns
    -------
    tuple
    """
    conn = mysql.connect(host='localhost', user='root', password='root',
                         database=dbName, buffered=True)
    cur = conn.cursor()
    return conn, cur

def createDB(dbName: str) -> None:
    """

    Parameters
    ----------
    dbName :
        str:
    dbName :
        str:
    dbName:str :


    Returns
    -------

    """
    conn, cur = DBConnect()
    cur.execute(f"CREATE DATABASE IF NOT EXISTS {dbName};")
    conn.commit()
    cur.close()

def createTable(dbName: str, table_schema: str) -> None:
    """

    Parameters
    ----------
    dbName :
        str:
    dbName :
        str:
    dbName:str :


    Returns
    -------

    """
    conn, cur = DBConnect(dbName)
    fd = open(f"{cwd}/scripts/{table_schema}", 'r')
    readSqlFile = fd.read()
    fd.close()

    sqlCommands = readSqlFile.split(';')

    for command in sqlCommands:
        try:
            res = cur.execute(command)
        except Exception as ex:
            print("Command skipped: ", command)
            print(ex)
    conn.commit()
    cur.close()

    return

def insert_to_table(dbName: str, json_stream: json, table_name: str) -> None:
   
    conn, cur = DBConnect(dbName)
    insert_data=json.dumps([json.loads(json_stream)])
    df=pd.read_json(insert_data)
    # print(df.head())
    for _, row in df.iterrows():
        sqlQuery = f"""INSERT INTO {table_name} (trainee, email, asset, status) VALUES(%s,%s,%s,%s);"""
        data = (row[0], row[1], row[2], row[3])
        # data = (str(row[0]), str(row[1]), int(row[2]), str(row[3]))
        print(data)

        try:
            # Execute the SQL command
            cur.execute(sqlQuery, data)
            # Commit your changes in the database
            conn.commit()
            # print("Data Inserted Successfully")
        except Exception as e:
            conn.rollback()
            print("Error: ", e)

    print("All Data Inserted Successfully")
    return

def update_table(dbName: str, json_stream: json, table_name: str) -> None:
   
    conn, cur = DBConnect(dbName)
    update_data=json.dumps([json.loads(json_stream)])
    df=pd.read_json(update_data)
    for _, row in df.iterrows():
        sqlQuery = f"""
        UPDATE {table_name} SET asset = %s, status = %s WHERE email = %s;
        """
  
        data = (int(row[0]), str(row[1]), str(row[2]))


        try:
            # Execute the SQL command
            cur.execute(sqlQuery, data)
            # Commit your changes in the database
            conn.commit()
            # print("Data Inserted Successfully")
        except Exception as e:
            conn.rollback()
            print("Error: ", e)

    print("All Data Updated Successfully")
    return

def db_get_values(dbName: str="trainee"):
    conn, cur = DBConnect(dbName)
    sqlQuery = 'SELECT * FROM trainee;'
    try:
        cur.execute(sqlQuery)
        result = cur.fetchall()
        conn.commit()
        return result
    except Exception as e:
        conn.rollback()
        print("Error: ", e)
    
def db_get_values_by_asset(asset:str,dbName: str="trainee"):
    conn, cur = DBConnect(dbName)
    sqlQuery = f'SELECT remark,email FROM trainee WHERE asset = {asset};'
    try:
        cur.execute(sqlQuery)
        result = cur.fetchall()
        conn.commit()
        return result
    except Exception as e:
        conn.rollback()
        print("Error: ", e)