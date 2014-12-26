var assert=require("assert");
var index=require("./index.js");
var fs = require("fs");

describe("index.js", function() {
  describe("groupById",function() { 
    it("should groupById - different IDs", function() {
      var list = [
      	new index.Item("e1","p1"),
      	new index.Item("e1","p1"),
      	new index.Item("e2","p1"),
      	new index.Item("e1","p1")
  	  ];
      var grouped = index.groupById(list);
      assert.equal(3, grouped["e1"]);
      assert.equal(1, grouped["e2"]);
    });
  it("should groupById - IDs containing spaces match", function() {
      var list = [
        new index.Item("e1 ","p1"),
        new index.Item("e1","p1")
      ];
      var grouped = index.groupById(list);
      assert.equal(2, grouped["e1"]);
    });
    it("should groupById no items gives empty object", function() {
      var list = [];
      var grouped = index.groupById(list);
      assert.deepEqual(grouped,{});
    });
  });
  describe("renderMasterPage prints html", function() {
    it("should put content in right places", function(){
          // re-generate base-file.
          // fs.writeFileSync ("renderMasterPage_prints_html.txt", index.renderMasterPage("content","groupedContent"));

          // Not sure how else to do this - multi-line quotes did not seem to work.
          var expectedText = fs.readFileSync("renderMasterPage_prints_html.txt");
          assert.equal(index.renderMasterPage("content","groupedContent"), expectedText);
      })
  });
  describe("renderItemsBody suite",function(){
    it("should print informational message when no items given", function(){
        assert.equal("<li>No items logged.</li>",index.renderItemsBody([]));
    });
    it("should print and list single item", function(){
        var items=[
          new index.Item("event1", "name1", 123456789, "127.0.0.1")
        ];
        var expectedText="<li>Fri, 02 Jan 1970 10:17:36 GMT event1 name1  [127.0.0.1]</li>";
        assert.equal(expectedText, index.renderItemsBody(items));

    });
    it("should print and list two items in order of list", function(){
        var items=[
          new index.Item("event1", "name1", 123456789, "127.0.0.1"),
          new index.Item("event2", "name2", 223456999, "127.0.0.1")
        ];
        var expectedText=
"<li>Fri, 02 Jan 1970 10:17:36 GMT event1 name1  [127.0.0.1]</li>\
<li>Sat, 03 Jan 1970 14:04:16 GMT event2 name2  [127.0.0.1]</li>";
        assert.equal(expectedText, index.renderItemsBody(items));

    });
  });
});
