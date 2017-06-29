const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id: 1,
                name: 'user 1',
                room: 'room 1'
            },
            {
                id: 2,
                name: 'user 2',
                room: 'room 2'
            },
            {
                id: 3,
                name: 'user 3',
                room: 'room 1'
            }
        ];
    });
    it('should add a new User', () => {
        const id = 4;
        const name = 'Someone';
        const room = 'Someroom';
        const user = { id, name, room };
        const res = users.addUser(id, name, room);

        expect(res).toInclude(user);
        expect(users.users).toContain(user);
    });

    it('should return user names for a room', () => {
        const res = users.getUserList(users.users[0].room);
        expect(res).toEqual(['user 1', 'user 3']);
    });

    it('should reomve a user', () => {
        const user = users.removeUser(users.users[0].id);
        expect(user).toEqual({
            id: 1,
            name: 'user 1',
            room: 'room 1'
        });
        expect(users.users.length).toBe(2);
    });

    it('should not reomve user', () => {
        expect(users.removeUser(-1)).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find a user', () => {
        const res = users.getUser(1);
        expect(res).toInclude(users.users[0]);
    });

    it('should not find user', () => {
        const res = users.getUser(-1);
        expect(res).toNotExist();
    });
});
