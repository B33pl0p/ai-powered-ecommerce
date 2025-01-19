import psycopg2
import csv

conn = psycopg2.connect(host="localhost", dbname="postgres", user="postgres", password="sikatahawa", port=5432)

cur = conn.cursor()


image_path = '/home/saurav/Documents/CSV_MANIPULATION'

#table for electronics
cur.execute("""CREATE TABLE IF NOT EXISTS electronics(
    Name VARCHAR(255),
    CategoryName VARCHAR(255),
    ImageUrl VARCHAR(255),
    Images BYTEA
);  
""")

with open('/home/saurav/Documents/hamrobazar_dataset/hamrobazar/electronics.csv', 'r') as f:
    next(f)  # Skip header
    cur.copy_expert("COPY electronics(Name, CategoryName, ImageUrl) FROM STDIN WITH CSV HEADER", f)


#table for apparel
cur.execute("""CREATE TABLE IF NOT EXISTS apparel(
    Name VARCHAR(255),
    CategoryName VARCHAR(255),
    ImageUrl VARCHAR(255)
);  
""")

#inserting image in the table
def image_to_binary_conversion(image_path):
    try:
        with open(image_path, 'rb') as file:
            binary_data = file.read()
            return binary_data

    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")

for image in image_path:
    



with open('/home/saurav/Documents/hamrobazar_dataset/hamrobazar/apparel-accessories.csv', 'r') as f:
    next(f) 
    cur.copy_expert("COPY apparel(Name, CategoryName, ImageUrl) from STDIN WITH CSV HEADER", f)


#cur.execute('''ALTER TABLE apparel ADD COLUMN ProductID SERIAL PRIMARY KEY;''') 

cur.execute('''select * from electronics;''')

conn.commit()
cur.close()
conn.close()