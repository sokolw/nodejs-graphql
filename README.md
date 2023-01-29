- Среда разработки:
  - Версия Node.js: `LTS v18.12.1`
  - ОС: `Windows 10 Enterprise LTSC 2019`

- Установка:
  - клонируйте репозиторий.
  - установить зависимости: `npm i`

- Задания:
1. реализация restful конечных точек:
    - 1.1 запускаем проверку исходных файлов: `npm run check-integrity`.
      - если тест закончился неудачей то проверьте какой тип разрыва строки, он должен быть `LF`.
    - 1.2 запускаем тесты `npm run test`.
2. реализация graphql конечной точки:
    - запуск сервера в prod `npm run start`
    - запуск сервера в dev `npm run dev`
    - есть возможность, но не обязательно. После запуска сервера можно запустить мои моковые данные которые я использовал `npm run mocks`. Базовый url `http://localhost:3000` если используете другой порт, то укажите его в параметрах запуска.
    - все запросы делаются через: method: `POST`, url: `/graphql`
    - для удобства можно использовать [GraphQL Playground for Chrome](https://chrome.google.com/webstore/detail/graphql-playground-for-ch/kjhjcgclphafojaeeickcokfbhlegecd). Т.к. при ручном написании запросов можно допустить ошибку.
    - 2.1 получаем users, profiles, posts, memberTypes в одном запросе, если в каком-то из полей не будет данных то вернется пустой массив.
      - JSON запрос:
      ```json
      {
        "query": "query { users { id email firstName lastName subscribedToUserIds } profiles { id sex } posts { id title } memberTypes { id discount monthPostsLimit } }"
      }
      ```
      - через GraphQL playground:
      ```
      query {
        users {
            id
            email
            firstName
            lastName
            subscribedToUserIds
        }
        profiles {
            id
            sex
        }
        posts {
            id
            title
        }
        memberTypes {
            id
            discount
            monthPostsLimit
        }
      }
      ```
    - 2.2 получаем user, profile, post, memberType в одном запросе у каждого свой id. Все запрашиваемые поля должны существовать иначе вернется соответсвующее сообщение об ошибке.
      - JSON запрос:
      ```json
      {
        "query": "query($userId: ID!, $profileId: ID!, $postId: ID!, $memberTypeId: String!) { user(id: $userId) { id firstName email } profile(id: $profileId) { id sex } post(id: $postId) { id title } memberType(id: $memberTypeId) { id discount monthPostsLimit } }",
        "variables": {
            "userId": "a4cbbcc8-6d85-43c0-903a-7844c8a45d47",
            "profileId": "f5c069c5-7ede-4153-a87e-4badf9f1c46c",
            "postId": "59b51355-3df6-462e-bb17-683af327fc33",
            "memberTypeId": "business"
        }
      }
      ```
      - через GraphQL playground:
      ```
      query($userId: ID!, $profileId: ID!, $postId: ID!, $memberTypeId: String!) {
        user(id: $userId) {
            id
            firstName
            email
        }
        profile(id: $profileId) {
            id
            sex
        }
        post(id: $postId) {
            id
            title
        }
        memberType(id: $memberTypeId) {
            id
            discount
            monthPostsLimit
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "userId": "4dbd1727-5cb4-41f8-95c6-8f25e5530aa2",
        "profileId": "201d5c50-00b1-4b1e-933a-2ea5024d036c",
        "postId": "99d9187f-9307-4907-8214-6b27a6a8e129",
        "memberTypeId": "business"
      }
      ```
    - 2.3 получаем users с их списком posts, profiles, memberTypes. Если в одном из полей нет данных то вернется пустой массив.
      - JSON запрос:
      ```json
      {
        "query": "query { users{ id firstName lastName posts { id title } profiles { id birthday } memberTypes { id monthPostsLimit } } }"
      }
      ```
      - через GraphQL playground:
      ```
      query {
        users{
            id
            firstName
            lastName
            posts {
                id
                title
            }
            profiles {
                id
                birthday
            }
            memberTypes {
                id
                monthPostsLimit
            }
        }
      }
      ```
    - 2.4 получаем user by id c его posts, profile, memberType. Если у пользователя нет профиля (следовательно нет и memberType), то вернется `null`. Допустим пользователь еще не заполнил профиль.
      - JSON запрос:
      ```json
      {
        "query": "query($userId: ID!) { user(id: $userId){ id firstName lastName posts { id title } profile { id avatar } memberType { id } } }",
        "variables": {
            "userId": "7f9bed4a-73fe-44ca-8478-2b3b4f71674a"
        }
      }
      ```
      - через GraphQL playground:
      ```
      query($userId: ID!) {
        user(id: $userId){
            id
            firstName
            lastName
            posts {
                id
                title
            }
            profile {
                id
                avatar
            }
            memberType {
                id
            }
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "userId": "fad5d9a8-9d8c-4967-8e40-a50ed42e0c7c"
      }
      ```
    - 2.5 получаем users с их `userSubscribedTo` (пользователи которых отслеживает текущий пользователь), profile. Если у пользователя нет профиля, то вернется `null`. Если нет `userSubscribedTo` то вернется пустой массив.
      - JSON запрос:
      ```json
      {
        "query": "query { users { id firstName lastName profile { id avatar birthday } userSubscribedTo { id firstName lastName } } }"
      }
      ```
      - через GraphQL playground:
      ```
      query {
        users {
            id
            firstName
            lastName
            profile {
                id
                avatar
                birthday
            }
            userSubscribedTo {
                id
                firstName
                lastName
            }
        }
      }
      ```
    - 2.6 получаем user by id с его `subscribedToUser` (пользователи которые подписаны на текущего пользователя), posts. Если у пользователя нет постов, то вернется пустой массив. Если нет `subscribedToUser` то вернется пустой массив.
      - JSON запрос:
      ```json
      {
        "query": "query($userId: ID!) { user(id: $userId) { id firstName lastName posts { id content } subscribedToUser { id firstName lastName } } }",
        "variables": {
            "userId": "25601a39-6b01-4a08-9641-47eb84424a6c"
        }
      }
      ```
      - через GraphQL playground:
      ```
      query($userId: ID!) {
        user(id: $userId) {
            id
            firstName
            lastName
            posts {
                id
                content
            }
            subscribedToUser {
                id
                firstName
                lastName
            }
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "userId": "25601a39-6b01-4a08-9641-47eb84424a6c"
      }
      ```
    - 2.7 получаем users с их `userSubscribedTo`, `subscribedToUser`.
      - JSON запрос:
      ```json
      {
        "query": "query { users { id firstName lastName userSubscribedTo { id firstName lastName } subscribedToUser { id firstName lastName } } }"
      }
      ```
      - через GraphQL playground:
      ```
      query {
        users {
            id
            firstName
            lastName
            userSubscribedTo {
                id
                firstName
                lastName
            }
            subscribedToUser {
                id
                firstName
                lastName
            }
        }
      }
      ```
      - Доп. запрос каждый user с полями `userSubscribedTo`, `subscribedToUser` в каждое из этих полей вложены: `userSubscribedTo`, `subscribedToUser`.
      - через GraphQL playground:
      ```
      query {
        users {
            id
            firstName
            lastName
            userSubscribedTo {
                id
                firstName
                lastName
                userSubscribedTo {
                    id
                    firstName
                    lastName
                }
                subscribedToUser {
                    id
                    firstName
                    lastName
                }
            }
            subscribedToUser {
                id
                firstName
                lastName
                userSubscribedTo {
                    id
                    firstName
                    lastName
                }
                subscribedToUser {
                    id
                    firstName
                    lastName
                }
            }
        }
      }
      ```
    - 2.8 создание user. При создании user все поля обязательные.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($user: AddUserInput!) { createUser(input: $user) { firstName lastName email id } }",
        "variables": {
            "user": {
                "firstName": "Banan4ik_gql",
                "lastName": "Fresh",
                "email": "gg@gg"
            }
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($user: AddUserInput!) {
        createUser(input: $user) {
          firstName
          lastName
          email
          id
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "user": {
            "firstName": "Banan4ik_gql",
            "lastName": "Fresh",
            "email": "gg@gg"
        }
      }
      ```
    - 2.9 создание profile. При создании profile все поля обязательные.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($profile: AddProfileInput!) { createProfile(input: $profile) { id city avatar } }",
        "variables": {
            "profile": {
                "avatar": "img://test2.jpg",
                "sex": "male",
                "birthday": 1984958,
                "country": "Belarus",
                "street": "Swamp street",
                "city": "Minsk",
                "userId": "b7ac4a9a-8fcc-439c-baf9-b566027dd3b2",
                "memberTypeId": "business"
            }
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($profile: AddProfileInput!) {
        createProfile(input: $profile) {
          id
          city
          avatar
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "profile": {
            "avatar": "img://test2.jpg",
            "sex": "male",
            "birthday": 1984958,
            "country": "Belarus",
            "street": "Swamp street",
            "city": "Minsk",
            "userId": "7bfdb1a6-f25e-40b4-bbf3-ae1aabe366cf",
            "memberTypeId": "business"
        }
      }
      ```
    - 2.10 создание post. При создании post все поля обязательные.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($post: AddPostInput!) { createPost(input: $post) { id title content } }",
        "variables": {
            "post": {
                "title": "Post example gql",
                "content": "Someeeee text by user N",
                "userId": "4bdc1ee0-24d1-4f33-a3a1-b9dfd83f2c54"
            }
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($post: AddPostInput!) {
        createPost(input: $post) {
          id
          title
          content
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "post": {
            "title": "Post example gql",
            "content": "Someeeee text by user N",
            "userId": "4bdc1ee0-24d1-4f33-a3a1-b9dfd83f2c54"
        }
      }
      ```
    - 2.11 InputObjectType for DTOs.
      - [code](https://github.com/sokolw/nodejs-graphql/blob/dev/src/routes/graphql/schema-gql/types/inputTypes.ts)
    - 2.12 изменить user. При изменении user не все поля обязательны.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($id: ID!, $user: UpdateUserInput!) { updateUser(id: $id, input: $user) { id firstName lastName email } }",
        "variables": {
            "id": "178e9b72-7802-45d0-9454-70cc46b52b6d",
            "user": {
                "firstName": "Viiiiy1",
                "lastName": "Booo",
                "email": "gogog@go"
            }
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($id: ID!, $user: UpdateUserInput!) {
        updateUser(id: $id, input: $user) {
          id
          firstName
          lastName
          email
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "id": "178e9b72-7802-45d0-9454-70cc46b52b6d",
        "user": {
            "firstName": "Viiiiy",
            "lastName": "Booo",
            "email": "gogog@go"
        }
      }
      ```
    - 2.13 изменить profile. При изменении profile не все поля обязательны. При неверном указании memberTypeId для его изменения вернется ошибка.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($id: ID!, $profile: UpdateProfileInput!) { updateProfile(id: $id, input: $profile) { id avatar birthday country country } }",
        "variables": {
            "id": "8ca05f3b-a458-4383-b152-a61fd632ff41",
            "profile": {
                "avatar": "img://phonk2.jpg",
                "sex": "male",
                "birthday": 29984958,
                "country": "Belarus",
                "street": "Main street",
                "city": "Mogilev",
                "memberTypeId": "basic"
            }
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($id: ID!, $profile: UpdateProfileInput!) {
        updateProfile(id: $id, input: $profile) {
          id
          avatar
          birthday
          country
          country
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "id": "8ca05f3b-a458-4383-b152-a61fd632ff41",
        "profile": {
            "avatar": "img://phonk.jpg",
            "sex": "male",
            "birthday": 29984958,
            "country": "Belarus",
            "street": "Main street",
            "city": "Mogilev",
            "memberTypeId": "basic"
        }
      }
      ```
    - 2.14 изменить post. При изменении post не все поля обязательны.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($id: ID!, $post: UpdatePostInput!) { updatePost(id: $id, input: $post) { id title content } }",
        "variables": {
            "id": "3df73bec-f5a0-4dab-b03a-6a2fe64407db",
            "post": {
                "title": "Post example 100",
                "content": "Someeeee text by user 3x^3+C"
            }
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($id: ID!, $post: UpdatePostInput!) {
        updatePost(id: $id, input: $post) {
          id
          title
          content
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "id": "3df73bec-f5a0-4dab-b03a-6a2fe64407db",
        "post": {
            "title": "Post example 100",
            "content": "Someeeee text by user N+10"
        }
      }
      ```
    - 2.15 изменить memberType. При изменении memberType не все поля обязательны.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($id: String!, $memberType: UpdateMemberTypeInput!) { updateMemberType(id: $id, input: $memberType) { id discount monthPostsLimit } }",
        "variables": {
            "id": "basic",
            "memberType": {
                "discount": 9000,
                "monthPostsLimit": 9999
            }
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($id: String!, $memberType: UpdateMemberTypeInput!) {
        updateMemberType(id: $id, input: $memberType) {
          id
          discount
          monthPostsLimit
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "id": "basic",
        "memberType": {
            "discount": 1001,
            "monthPostsLimit": 9999
        }
      }
      ```
    - 2.16/a подписаться на пользователя. `subscriberUserId` - подпищик,  `followUserId` - отслеживаемый пользователь.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($subscriberUserId: ID!, $followUserId: ID!) { subscribeTo(subscriberId: $subscriberUserId, followId: $followUserId) { id firstName lastName subscribedToUserIds } }",
        "variables": {
            "subscriberUserId": "b895301d-dbc7-4df4-9f1a-d05376b6ebb5",
            "followUserId": "8df391fc-dd2e-432c-91d1-00fbe7599000"
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($subscriberUserId: ID!, $followUserId: ID!) {
        subscribeTo(subscriberId: $subscriberUserId, followId: $followUserId) {
          id
          firstName
          lastName
          subscribedToUserIds
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "subscriberUserId": "b895301d-dbc7-4df4-9f1a-d05376b6ebb5",
        "followUserId": "8df391fc-dd2e-432c-91d1-00fbe7599000"
      }
      ```
    - 2.16/b отписаться от пользователя.
      - JSON запрос:
      ```json
      {
        "mutation": "mutation($subscriberUserId: ID!, $followUserId: ID!) { unsubscribeFrom(subscriberId: $subscriberUserId, followId: $followUserId) { id firstName lastName subscribedToUserIds } }",
        "variables": {
            "subscriberUserId": "e9acf5ad-eb8a-454c-8dfa-fa89b9d2ab19",
            "followUserId": "e886f441-0811-45b5-b24c-6cac003c96b6"
        }
      }
      ```
      - через GraphQL playground:
      ```
      mutation($subscriberUserId: ID!, $followUserId: ID!) {
        unsubscribeFrom(subscriberId: $subscriberUserId, followId: $followUserId) {
          id
          firstName
          lastName
          subscribedToUserIds
        }
      }
      ```
      GraphQL variables:
      ```json
      {
        "subscriberUserId": "e9acf5ad-eb8a-454c-8dfa-fa89b9d2ab19",
        "followUserId": "e886f441-0811-45b5-b24c-6cac003c96b6"
      }
      ```
    - 2.17 InputObjectType for DTOs.
      - [code](https://github.com/sokolw/nodejs-graphql/blob/dev/src/routes/graphql/schema-gql/types/inputTypes.ts)
3. `n+1` graphql problem с использованием [dataloader](https://www.npmjs.com/package/dataloader)
    - подключение загрузчиков в graphql контекст:
      - [code](https://github.com/sokolw/nodejs-graphql/blob/4f1d922b3d29e0e43feea48bdaec992a6d4f90c5/src/routes/graphql/index.ts#L31)
    - использование загрузчиков в graphql resolver:
      - [code](https://github.com/sokolw/nodejs-graphql/blob/dev/src/routes/graphql/schema-gql/resolvers/user.ts)
      - [code](https://github.com/sokolw/nodejs-graphql/blob/4f1d922b3d29e0e43feea48bdaec992a6d4f90c5/src/routes/graphql/schema-gql/resolvers/query.ts#L11)
    - файл с загрузчиками:
      - [code](https://github.com/sokolw/nodejs-graphql/blob/dev/src/routes/graphql/data-loaders.ts)
4. ограничение вложенности запроса с использованием [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit)
    - по умолчанию вложенность до 6 уровней.
    - место его использования в коде: [code](https://github.com/sokolw/nodejs-graphql/blob/4f1d922b3d29e0e43feea48bdaec992a6d4f90c5/src/routes/graphql/index.ts#L29)