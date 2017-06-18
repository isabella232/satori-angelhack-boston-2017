This howto shows how to develop and test a Satori template bot.

# Running a bot locally


In order to run a bot locally, we need to download the standalone execution framework version relevant to our bot (the one that the bot was built against). You can get the current version of the execution framework from the following location:

https://github.com/satori-com/satori-bots-java-core/releases/download/executor/execution-framework-public.jar


Next, you need to update the `config-example.json` file and replace all instances of the words `APPKEY` and `HOST` 
with your endpoint and appkeys that you received from DevPortal.

To start your bot in your IDE, start the `MyBot.java` as an Java application.  For example, to run your bot from within the IntelliJ IDE,
follow these steps.

* Click on the the green arrow next to the `main` method in `MyBot.java`. This will create a new run configuration called `MyBot`.  
* Click on the green arrow next to your new configuration to run the application.
 
The MyBot example is now up and running and listening for incoming messages.  

# Testing your Bot
Satori provides a tool to send/receive messages and to test your bot. To install the satori cli utilities,
run the following command on your machine: `pip install satori-cli`.

The `MyBot.java` example copies traffic from the channel `example.in` to the channel `example.out`. Have a look at `config-example.json` to see how we configure it.

* Let's start a client that listens to the `example.out` channel:
```
satori_cli.py --endpoint=<your_endpoint> --appkey=<your_appkey> subscribe example.out
```

* Let's now publish to `example.in` channel:
```
echo '{"brand":"batman", "model":"forever", "catchphrase":"ILikePenguins"}' | satori_cli.py --endpoint=<your_endpoint> --appkey=<your_appkey> publish example.in
```

The RTM subscriber started above should now start receiving data.

Alternatively, the `MyBot.java` example also uses a logger to log the incoming messages.  You should be able to run the `tail` 
utility to monitor messages that are being logged.  If you check your project diretory, you'll see that a `log` directory is created.
You should be able to run the following command to monitor all incoming log messages.
```bash
tail -f user.log
```

If you want to make changes to the behavior of your bot, just stop your `MyBot.java` application and restart the application
after you make your changes.   

Once you are satisfied with your changes to your bot and want to upload your bot to DevPortal, 
you'll need to create an archive file.  Run the following command (or run the corresponding gradle task from the IDE):
```
./gradlew botJar
```
This will create a new jar file which can be uploaded.
