const request = require('request');

module.exports = function(config) {
    const self = this;
    self.config = config;

    self.apiURL = self.config.url || "https://api.logware.io/api";
    self.authToken = self.config.authToken || false;
    self.username = self.config.username;
    self.password = self.config.password;
    self.environment = self.config.environment || 'test'

    self._request = function(method, path, data, allDone) {
        self.authenticate(function(err, authToken) {
            const authorization = `Bearer ${authToken}`;
            const options = {
                method,
                url: `${self.apiURL}/${path}`,
                headers: {
                    authorization,
                },
                json: true
            }

            if(method === 'GET') {
                options.qs = data;
            } else {
                options.body = data;
            }

            request(options, function (error, response, body) {
                const returnMe = {
                    body
                }
                if(response.headers.hasOwnProperty('location'))
                    returnMe.location = response.headers.location;
                returnMe.status = response.statusCode;

                allDone(error, returnMe);
            });
        });
    }

    self._clearToken = function() {
        self.authToken = false;
    }

    self.authenticate = function(allDone) {
        if(self.authToken)
            return allDone(null, self.authToken);

        const options = {
            method: 'POST',
            url: `${self.apiURL}/users/authenticate`,
            json: true,
            body: {
                Login: self.username,
                Password: self.password
            }
        };

        request(options, function (error, response, body) {
            if(error)
                return allDone(error, false);

            if(body.token) {
                self.authToken = body.token;
                setTimeout(self._clearToken, 36000);
            }

            return allDone(null, self.authToken);
        });
    }

    self.getData = function(txid, allDone) {
        const options = {
            method: 'GET',
            url: `https://chaindata.logware.io/tx/${txid}`,
            json: true
        }
        request(options, function(err, response, body) {
            if(response.statusCode === 404) {
                return allDone("NotFound", {status: response.statusCode});
            }
            return allDone(err, {data: body.pkdata, body, status: response.statusCode});
        })
    }

    self.insertData = function(payload, allDone) {
        self._request('POST', 'data', {env: self.environment, data: payload}, allDone);
    }

    self.getDataInsertResults = function(taskID, allDone) {
        self._request('GET', `data/${self.environment}/${taskID}`, {}, allDone);
    }

    self.insertHash = function(hash, allDone) {
        self._request('POST', 'hash', {env: self.environment, hash}, allDone);
    }

    self.getHashInsertResults = function(taskID, allDone) {
        self._request('GET', `hash/${self.environment}/${taskID}`, {}, allDone);
    }

};