const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', function (req, res) {
    var generateDirectoryInfo = function(dir, done) {
        var node = {
            data: [],
            children: []
        };

        fs.readdir(dir, function(err, list) {
            if (err) return done(err);

            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, node);
                var fullPath = dir + '/' + file;
                fs.stat(fullPath, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        generateDirectoryInfo(fullPath, function(err, res) {
                            node.children.push(res);
                            next();
                        });
                    } else if (!err) {
                        node.data.push({
                            name: file,
                            size: fs.statSync(fullPath).size
                        });
                        next();
                    } else {
                        next();
                    }
                });
            })();
        });
    };

    generateDirectoryInfo(__dirname, function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(4040, () => console.log('App listening on port 4040'))