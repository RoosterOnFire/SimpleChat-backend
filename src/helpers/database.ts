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
  `create table if not exists users (userId text, sessionId text, username text)`,
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

export async function addUser(
  userId: string,
  sessionId: string,
  username: string
): Promise<void> {
  const user = await findUser(sessionId);
  if (user) {
    return;
  }

  return runUsers('insert into users values (?, ?, ?)', [
    userId,
    sessionId,
    username,
  ]);
}

export async function findUser(sessionId: string): Promise<User> {
  const query = await queryUsers('select * from users where sessionId = ?', [
    sessionId,
  ]);

  return query[0];
}

export async function findAndRemoveUser(id: string): Promise<User> {
  const query = await queryUsers('select * from users where sessionId = ?', [
    id,
  ]);
  const user = query[0];

  await runUsers('delete from users where sessionId = ?', [id]);

  return user;
}

export function getUsers(): Promise<Users> {
  return queryUsers('select * from users');
}

export async function isUsedUsername(username: string) {
  const user = await queryUsers(
    'select username from users where username = ?',
    [username]
  );

  return user.length > 0;
}
