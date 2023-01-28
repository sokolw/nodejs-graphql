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
    - все запросы делаются через: method: `POST`, url: `/graphql`
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
    - 2.4 получаем user by id c его posts, profile, memberType. Если у пользователя нет профиля (следовательно нет и memberType), то вернется сообщение об ошибке.
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
    - 2.5 получаем users с их `userSubscribedTo` (пользователи которых отслеживает текущий пользователь), profile. Если у пользователя нет профиля, то вернется сообщение об ошибке. Если нет `userSubscribedTo` то вернется пустой массив.
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
    - 2.11 изменить user. При изменении user не все поля обязательны.
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
    - 2.12 изменить profile. При изменении profile не все поля обязательны. При неверном указании memberTypeId для его изменения вернется ошибка.
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
    - 2.13 изменить post. При изменении post не все поля обязательны.
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
    - 2.14 изменить memberType. При изменении memberType не все поля обязательны.
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
    - 2.15 подписаться на пользователя. `subscriberUserId` - подпищик,  `followUserId` - отслеживаемый пользователь.
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
    - 2.16 отписаться от пользователя.
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
3. 

### Tasks:

2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR.  
All dynamic values should be sent via "variables" field.  
If the properties of the entity are not specified, then return the id of it.  
`userSubscribedTo` - these are users that the current user is following.  
`subscribedToUser` - these are users who are following the current user.  
   
   <!-- * Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.  
   2.3. Get users with their posts, profiles, memberTypes.  
   2.4. Get user by id with his posts, profile, memberType.   -->
   <!-- 2.5. Get users with their `userSubscribedTo`, profile.   -->
   <!-- 2.6. Get user by id with his `subscribedToUser`, posts.   -->
   <!-- 2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).   -->
   * Create gql requests:   
   <!-- 2.8. Create user.   -->
   <!-- 2.9. Create profile.   -->
   2.10. Create post.  
   2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  
   * Update gql requests:  
   <!-- 2.12. Update user.   -->
   <!-- 2.13. Update profile.   -->
   <!-- 2.14. Update post.   -->
   2.15. Update memberType.  
   2.16. Subscribe to; unsubscribe from.  
   2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  

3. Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
   You can use only one "findMany" call per loader to consider this task completed.  
   It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.  
   3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).  
4. Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.   
   4.1. Provide a link to the line of code where it was used.  
   4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.  

### Description:  
All dependencies to complete this task are already installed.  
You are free to install new dependencies as long as you use them.  
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.  
All templates for restful endpoints are placed, just fill in the logic for each of them.  
Use the "db" property of the "fastify" object as a database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).  

### Description for the 1 task:
If the requested entity is missing - send 404 http code.  
If operation cannot be performed because of the client input - send 400 http code.  
You can use methods of "reply" to set http code or throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors).  
If operation is successfully completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).  

Relation fields are only stored in dependent/child entities. E.g. profile stores "userId" field.  
You are also responsible for verifying that the relations are real. E.g. "userId" belongs to the real user.  
So when you delete dependent entity, you automatically delete relations with its parents.  
But when you delete parent entity, you need to delete relations from child entities yourself to keep the data relevant.   
(In the next rss-school task, you will use a full-fledged database that also can automatically remove child entities when the parent is deleted, verify keys ownership and instead of arrays for storing keys, you will use additional "join" tables)  

To determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).  

### Description for the 2 task:  
You are free to create your own gql environment as long as you use predefined graphql endpoint (./src/routes/graphql/index.ts).  
(or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))  

### Description for the 3 task:
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  

### Description for the 4 task:  
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties `userSubscribedTo`, `subscribedToUser` and users within them can also have `userSubscribedTo`, `subscribedToUser` and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to (for example) 6 levels max.
