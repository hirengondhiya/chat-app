// class User {
//     constructor(id, name, room) {
//         this.id = id;
//         this.name = name;
//         this.room = room;
//     }
// }

class Users {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        let user = { id, name, room };
        this.users.push(user);
        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room) {
        const users = this.users.filter((user) => user.room === room);
        return users.map((user) => user.name);
    }
    removeUser(id) {
        const user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((u) => u.id !== id);
        }
        return user;
    }
}

module.exports = {
    // User,
    Users
};
