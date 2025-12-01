import os
import getpass
import argparse

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from psycopg2 import sql

# Default app DB credentials 
APP_DB_NAME = os.getenv("MYCHOICE_DB_NAME", "mychoice_db")
APP_DB_USER = os.getenv("MYCHOICE_DB_USER", "mychoice_user")
APP_DB_PASSWORD = os.getenv("MYCHOICE_DB_PASSWORD", "mychoice_password")

def parse_args():
    """
    Allow the end user to customize how we connect to PostgreSQL.
    """
    parser = argparse.ArgumentParser(
        description="Create the mychoice Postgres role and database if they do not exist."
    )

    parser.add_argument(
        "--superuser",
        default=os.getenv("DB_SUPERUSER", getpass.getuser()),
        help=(
            "PostgreSQL superuser/role to connect with. "
            "Defaults to $DB_SUPERUSER or current OS user."
        ),
    )
    parser.add_argument(
        "--host",
        default=os.getenv("DB_HOST", "localhost"),
        help="PostgreSQL host (default: localhost or $DB_HOST).",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("DB_PORT", "5432")),
        help="PostgreSQL port (default: 5432 or $DB_PORT).",
    )
    parser.add_argument(
        "--database",
        default=os.getenv("DB_NAME", "postgres"),
        help="Database to connect to for admin operations (default: postgres or $DB_NAME).",
    )
    parser.add_argument(
        "--password",
        default=os.getenv("DB_SUPERUSER_PASSWORD"),
        help=(
            "Password for the superuser role. "
            "Defaults to $DB_SUPERUSER_PASSWORD. If omitted, passwordless/peer auth is used."
        ),
    )

    return parser.parse_args()


def main():
    args = parse_args()

    # Build connection kwargs dynamically so we only pass password if we have one
    conn_kwargs = {
        "dbname": args.database,
        "user": args.superuser,
        "host": args.host,
        "port": args.port,
    }
    if args.password:
        conn_kwargs["password"] = args.password

    try:
        # Connect to PostgreSQL as a superuser/admin role
        conn = psycopg2.connect(**conn_kwargs)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        # 1) Create role if it does not exist
        cur.execute(
            "SELECT 1 FROM pg_roles WHERE rolname = %s;",
            (APP_DB_USER,),
        )
        role_exists = cur.fetchone()

        if not role_exists:
            print(f"Creating database role {APP_DB_USER!r}...")
            cur.execute(
                sql.SQL("CREATE ROLE {} WITH LOGIN PASSWORD %s;").format(
                    sql.Identifier(APP_DB_USER)
                ),
                (APP_DB_PASSWORD,),
            )
            cur.execute(
                sql.SQL("ALTER ROLE {} CREATEDB;").format(
                    sql.Identifier(APP_DB_USER)
                )
            )
        else:
            print(f"Role {APP_DB_USER!r} already exists.")

        # 2) Create database if it does not exist
        cur.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s;",
            (APP_DB_NAME,),
        )
        db_exists = cur.fetchone()

        if db_exists:
            print("My Choice DB Already Exists.")
        else:
            print(f"Creating My Choice DB {APP_DB_NAME!r} owned by {APP_DB_USER!r}...")
            cur.execute(
                sql.SQL("CREATE DATABASE {} OWNER {};").format(
                    sql.Identifier(APP_DB_NAME),
                    sql.Identifier(APP_DB_USER),
                )
            )
            print("Database created successfully.")

        cur.close()
        conn.close()

    except Exception as e:
        print("Error while creating role/database:")
        print(e)

if __name__ == "__main__":
    main()
