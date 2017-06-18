package com.satori.bots.example;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.satori.bots.framework.Ack;
import com.satori.bots.framework.Bot;
import com.satori.bots.framework.BotContext;
import com.satori.bots.framework.BotExecutor;
import com.satori.bots.framework.RtmException;
import com.satori.bots.framework.RtmSubscriptionData;
import org.slf4j.Logger;
import java.util.HashMap;
import java.util.Map;

/**
 * This simple bot republishes all received messages to a configurable outputChannel
 */
public class MyBot implements Bot {
  private static final Logger logger = BotContext.getLogger(MyBot.class);
  private Gson gson = new Gson();

  private String stateKey;

  private Map<Integer, Item> items = new HashMap<>();

  @Override
  public void onSetup(BotContext botContext) {

    // Retrieve the state key from the configuration
    final JsonObject object = botContext.getCustomConfiguration().getAsJsonObject();
    stateKey = object.get("stateKey").getAsString();

    // Initialize the state (if applicable)
    try {
      State s = botContext.getRtmProxy().read(stateKey, State.class);
      if (s != null) {
        items = s.getItems();
      }
    } catch (Exception e) {
      logger.error("Startup error: " + e);
    }

    logger.info("Initial state: " + items);
  }

  @Override
  public void onSubscriptionData(BotContext ctx, RtmSubscriptionData messages) {
    for (JsonElement msg : messages.getMessages()) {
      try {
        Command cmd = gson.fromJson(msg, Command.class);

        // Update the state and store it in KV
        switch (cmd.getCommand()) {
          case "insert":
          case "update":
            items.put(cmd.getItem().getId(), cmd.getItem());
            break;
          case "remove":
            items.remove(cmd.getItem().getId());
            break;
        }
        ctx.getRtmProxy().write(stateKey, new State(items, messages.getNextPointer()), Ack.NO);
        
        logger.info("Current state: '{}'", items);
      } catch (InterruptedException e) {
        logger.error("Execution interrupted", e);
        Thread.currentThread().interrupt();
      } catch (RtmException e) {
        logger.error("RTM problem: ", e);
      }
    }
  }

  public static void main(String[] args) throws Exception {
    System.out.println("User logs can be found in log/user.log");
    BotExecutor executor = new BotExecutor("config-example.json");
    executor.start(new MyBot());
  }
}
