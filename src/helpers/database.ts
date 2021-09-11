import { User, Users } from '../constants/type';
import { Database } from 'sqlite3';

const DATABASE_FILE = `${__dirname}/database.db`;

const db = new Database(DATABASE_FILE, (err) => {
  return err
    ? console.error(`Failed connecting:`, err.message)
    : console.info('DB connected');
});

function closeConnection() {
  db.close((err) => {
    return err
      ? console.error(err.message)
      : console.log('DB connection closed');
  });
}

db.run(
  `create table if not exists users (
    id text,
    nickname text)`,
  (err) => {
    if (err) {
      console.error(`${err.message}`);
    }
  }
);

export function runUsers(statement: string, args: any[] = []): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(statement, args, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

export function queryUsers(query: string, args: any[] = []): Promise<Users> {
  return new Promise((resolve, rejects) => {
    db.all(query, args, (err, row) => {
      return err ? rejects(err) : resolve(row);
    });
  });
}

export function addUser(id: string, nickname: string): Promise<void> {
  return runUsers('insert into users values (?, ?)', [id, nickname]);
}

export async function findUser(id: string): Promise<User> {
  const query = await queryUsers('select * from users where id = ?', [id]);

  return query[0];
}

export async function findAndRemoveUser(id: string): Promise<User> {
  const query = await queryUsers('select * from users where id = ?', [id]);
  const user = query[0];

  await runUsers('delete from users where id = ?', [id]);

  return user;
}

export function getUsers(): Promise<Users> {
  return queryUsers('select * from users');
}

export async function isExistingNickname(nickname: string) {
  const user = await queryUsers(
    'select nickname from users where nickname = ?',
    [nickname]
  );

  return user.length > 0;
}
