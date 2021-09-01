const firebase = {
    id: '',
    auth() {
        return this;
    },
    verifyIdToken(token) {
        if (`${token}`.includes('test')) {
            this.id = token;
            return this;
        }
        if (token === 'fail') {
            return {
                then() {
                    return {
                        catch(fn) {
                            fn();
                        },
                    };
                },
            };
        }
        return null;
    },
    then(next) {
        next({ uid: this.id });
        return {
            catch() {},
        };
    },
    getUser() {
        return 'test user';
    },
};

export default firebase;
