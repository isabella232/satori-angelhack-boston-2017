A simple todo list application showcasing Satori integration

* todolist-bare: basic version of the app
* todolist-rtm: app communicating over Satori (requires an appkey and an endpoint in `js/controllers/todoCtrl.js`) - state maintained in the channel's history buffer
* todolist-bot: app communicating over Satori (requires an appkey and an endpoint in `js/controllers/todoCtrl.js` and in `bot/config-example.json`) - state maintained in the KV store and handled by a bot
