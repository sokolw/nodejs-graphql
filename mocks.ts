import * as http from 'http';

const HOST = process.argv[2];

type UserPartial = { id: string; firstName: string };

const customFetch = async (
  url: string,
  options: { body?: unknown; method: string }
) => {
  const parsedUrl = new URL(url);
  return new Promise((resolve, reject) => {
    const data: unknown[] = [];
    const stringJson = JSON.stringify(options.body);
    const req = http.request(
      {
        path: parsedUrl.pathname,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(stringJson),
        },
        method: options.method,
      },
      (res: http.IncomingMessage) => {
        res.setEncoding('utf8');
        res.on('data', (chunk: unknown) => {
          data.push(chunk);
        });
        res.on('end', () => {
          resolve(JSON.parse(data.join('')));
        });
      }
    );
    req.on('error', () => {
      reject(new Error('Try again when the server starts!'));
    });
    req.write(stringJson);
    req.end();
  });
};

const users = [
  {
    firstName: 'Beyoncé Giselle',
    lastName: 'Knowles-Carter',
    email: 'Giselle@famous.com',
  },
  {
    firstName: 'Grisha',
    lastName: 'Averito',
    email: 'Grisha@gg',
  },
  {
    firstName: 'Banan4ik',
    lastName: 'Fresh',
    email: 'Banan4ik@gg',
  },
  {
    firstName: 'Alex',
    lastName: 'Stopov',
    email: 'Stop@gg',
  },
  {
    firstName: 'Serj',
    lastName: 'Korobkov',
    email: 'Korobkov@gg',
  },
];

const profiles = [
  {
    avatar: 'img://Beyoncé.jpg',
    sex: 'female',
    birthday: 1984958,
    country: 'USA',
    street: 'hide',
    city: 'hide',
    userId: '',
    memberTypeId: 'business',
  },
  {
    avatar: 'img://Grisha.jpg',
    sex: 'male',
    birthday: 1984958,
    country: 'Belarus',
    street: 'Swamp street',
    city: 'Minsk',
    userId: '',
    memberTypeId: 'basic',
  },
  {
    avatar: 'img://Banan4ik.jpg',
    sex: 'male',
    birthday: 1984958,
    country: 'Belarus',
    street: 'King street',
    city: 'Minsk',
    userId: '',
    memberTypeId: 'business',
  },
  {
    avatar: 'img://Alex.jpg',
    sex: 'male',
    birthday: 1984958,
    country: 'Belarus',
    street: 'Green street',
    city: 'Minsk',
    userId: '',
    memberTypeId: 'basic',
  },
  {
    avatar: 'img://Serj.jpg',
    sex: 'male',
    birthday: 1984958,
    country: 'Belarus',
    street: 'Koms. street',
    city: 'Minsk',
    userId: '',
    memberTypeId: 'basic',
  },
];

const postTemplate = (userId: string, firstName: string) => {
  return {
    title: `Post ${firstName}`,
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    userId,
  };
};

const createdUsers: UserPartial[] = [];

const createdProfiles: { id: string }[] = [];

const createMocks = async () => {
  try {
    for (const user of users) {
      const userRes = await customFetch(`${HOST}/users`, {
        body: user,
        method: 'POST',
      });
      createdUsers.push(userRes as UserPartial);
    }

    for (let i = 0; i < profiles.length; i++) {
      profiles[i].userId = createdUsers[i].id;
      const profileRes = await customFetch(`${HOST}/profiles`, {
        body: profiles[i],
        method: 'POST',
      });
      createdProfiles.push(profileRes as { id: string });
    }

    for (const user of createdUsers) {
      const randomCountPosts = Math.floor(Math.random() * 2) + 1;
      for (let index = 0; index < randomCountPosts; index++) {
        await customFetch(`${HOST}/posts`, {
          body: postTemplate(user.id, user.firstName),
          method: 'POST',
        });
      }
    }

    //all subscribeTo superStar
    const superStar = createdUsers[0];
    for (const user of createdUsers) {
      await customFetch(`${HOST}/users/${user.id}/subscribeTo`, {
        body: { userId: superStar.id },
        method: 'POST',
      });
    }

    console.log('\x1b[32m%s\x1b[0m', 'Mocks created! Have fun!');
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', `${(error as Error).message}`);
  }
};

createMocks();
