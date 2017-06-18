package com.satori.bots.example;

import java.util.Map;

public class State {

  Map<Integer, Item> items;
  String nextUpdate;

  public State(Map<Integer, Item> items, String nextUpdate) {
    this.items = items;
    this.nextUpdate = nextUpdate;
  }

  public Map<Integer, Item> getItems() {
    return items;
  }
}
