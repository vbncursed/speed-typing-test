import databases
import sqlalchemy

DATABASE_URL = "postgresql://postgres:password123@db/speed_typing_test"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)
