import psycopg2
import json
from decimal import Decimal

def query_db(db_name, password, host, user, port, ids):
    #try to connect to the postgresql db
    try :
        connection = psycopg2.connect(
            dbname = db_name,
            user = user,
            port = port,
            host = host 
        )
        #create a cursor

        cursor = connection.cursor()

        query = "SELECT * from products WHERE product_id IN %s"

        cursor.execute(query, (tuple(ids),))

        #fetch all the matching rows

        results = cursor.fetchall()
        print("************************")
        print(results)

            # Column Names
        columns = [
            'id', 'gender', 'category', 'subcategory', 'type', 'color', 
            'season', 'year', 'description', 'image_url', 'price', 'rating'
        ]

        # Custom JSON Encoder for Decimal
        class DecimalEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, Decimal):
                    return float(obj)
                return super().default(obj)

        # Convert to JSON
        json_results = json.dumps(
            [dict(zip(columns, row)) for row in results], 
            indent=4, cls=DecimalEncoder
        )

        # Print or return the result
        return json_results


        # Clean up
        cursor.close()
        connection.close()


    except Exception as e:
        return json.dumps({"error": str(e)})


