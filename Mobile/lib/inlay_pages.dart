import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fltr_test/widgets.dart';
import 'package:http/http.dart' as http;

class TextInlayPage extends StatefulWidget {
  const TextInlayPage({this.message = "", this.onNavigate, Key? key}) : super(key: key);
  final String message;
  final Function? onNavigate;
  @override
  State<StatefulWidget> createState() => _TextInlayPageState();
}

class _TextInlayPageState extends State<TextInlayPage>  {
  @override
  Widget build(BuildContext context) {
    if (widget.onNavigate != null) {
      widget.onNavigate!();
    }
    return Center(
      child: RichText(
        textAlign: TextAlign.center,
        text: TextSpan(
          text: widget.message,
          style: Theme.of(context).textTheme.headline1,
        ),
      ),
    );
  }
}

class LogoutPage extends StatefulWidget {
  const LogoutPage({this.message = "", required this.logout, Key? key}) : super(key: key);
  final String message;
  final Function(BuildContext) logout;
  @override
  State<StatefulWidget> createState() => _LogoutPageState();
}

class _LogoutPageState extends State<LogoutPage>  {
  @override
  Widget build(BuildContext context) {
    return Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Center(
        child: RichText(
          textAlign: TextAlign.center,
          text: TextSpan(
            text: widget.message,
            style: Theme.of(context).textTheme.headline1,
          ),
        ),
      ),
      Row(children: [Expanded(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(10, 20, 10, 10),
          child: ElevatedButton(onPressed: () {widget.logout(context); }, child: const Text("Back to Sign In", style: TextStyle(fontSize: 20),),)
        ),
      )])
    ]);
  }
}

class SettingsEntry extends ListTile {
  SettingsEntry({required String text, required BuildContext context, required Widget page, Key? key}) : super(title: Text(text), onTap: (){Navigator.of(context).push(MaterialPageRoute(builder: (context) => page));}, key: key);
}

class AccountPageList extends StatefulWidget {
  const AccountPageList({required this.usertoken, required this.logout, Key? key}) : super(key: key);
  final Function(BuildContext) logout;
  final String usertoken;
  @override
  State<StatefulWidget> createState() => _AccountPageListState();
}

class _AccountPageListState extends State<AccountPageList>  {
  @override
  Widget build(BuildContext context)  {
    return Navigator(pages: [MaterialPage(child: SafeArea(child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Expanded(child: ListView(
          padding: const EdgeInsets.all(10),
          children: <SettingsEntry>[
            SettingsEntry(text: "Friends", context: context, page: FriendsPage(usertoken: widget.usertoken)),
            SettingsEntry(text: "Logout", context: context, page: LogoutPage(message: "Logged out successfully.", logout: widget.logout))
          ],
        ))
      ],)))]
    );
  }
}

class FriendEntry extends ListTile {
  FriendEntry({required String name, required Function(String) delete, Key? key}) : super(title: Text(name), trailing: InkWell(child: const Icon(Icons.delete), onTap: () {delete(name);},), key: key);
}

class FriendsPage extends StatefulWidget  {
  const FriendsPage({required this.usertoken, Key? key}) : super(key: key);

  final String usertoken;

  @override
  State<StatefulWidget> createState() => _FriendsPageState();
}

class _FriendsPageState extends State<FriendsPage>  {
  List<Widget> friendsEntries = [];
  List<String> friends = [];
  bool init = false;

  void reqAddFriend(String friend) async  {
    addFriend(friend);

    var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/add"), headers: {"Cookie": 'access_token=${widget.usertoken}', 'Content-Type': 'application/json; charset=UTF-8',},
        body: jsonEncode({"email": friend}));

    print(response.body);
    getFriends();
  }

  void deleteFriend(String friend) async  {
    print(friend);
    Iterable<String> components = friend.split(RegExp(r"\((?=.+\)$)"));
    String name = components.elementAt(0).trimRight();
    print(name);
    String email = components.elementAt(1).replaceAll(RegExp(r"\)$"), "");
    print(email);
    var response = await http.delete(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/friend/$email"), headers: {"Cookie": 'access_token=${widget.usertoken}'});
    print(response.body);
    getFriends();
  }
  
  void addFriend(String friend) {
      friends.add(friend);
      friendsEntries.add(FriendEntry(name: friend, delete: deleteFriend,));
  }

  void getFriends() async {
    // TODO: Load initial friends list
    var response = await http.get(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/friends"), headers: {"Cookie": 'access_token=${widget.usertoken}'});
    var body = jsonDecode(response.body);
    print(body);
    friendsEntries.clear();
    friends.clear();
    for (Map friend in body["friends"]) {
      addFriend("${friend["display_name"]} (${friend["email"]})");
    }
    setState(() {

    });
  }

  @override
  Widget build(BuildContext context)  {
    if (!init) {
      getFriends();
      init = true;
    }

    return Scaffold(
      appBar: AppBar(title: const Text("Friends"), centerTitle: true, actions: [IconButton(onPressed: (){Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => AddFriendPage(usertoken: widget.usertoken, addFriend: reqAddFriend)));}, icon: const Icon(Icons.add))],),
      body: friendsEntries.isEmpty ? const TextInlayPage(message: "No friends! \n(or list is still loading)") : ListView(children: friendsEntries),
    );
  }
}

class AddFriendPage extends StatefulWidget  {
  const AddFriendPage({required this.usertoken, required this.addFriend, Key? key}) : super(key: key);
  final String usertoken;
  final Function(String) addFriend;

  @override
  State<StatefulWidget> createState() => _AddFriendPageState();
}

class _AddFriendPageState extends State<AddFriendPage>  {
  var friend;
  var possFriends;
  String _toAdd = "";

  void addFriend(String friend) async {
    // TODO: Add friend
    widget.addFriend(friend);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context)  {
    return Scaffold(
        appBar: AppBar(title: const Text("Add Friend"), centerTitle: true),
        body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(children: [Expanded(
              child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: TextField(
                    onChanged: (String input) {_toAdd = input;},
                    decoration: const InputDecoration(
                      labelText: "Friend's Email",
                      hintText: "123@gmail.com",
                    ),
                  )
              ),
            ),]),
            Row(children: [Expanded(child: Padding(padding: const EdgeInsets.all(10), child: ElevatedButton(child: const Text("Add Friend"), onPressed: () {addFriend(_toAdd);},))),]),
          ],
        ),
    ));
  }
}

class HomePage extends StatelessWidget  {
  const HomePage({required this.accesstoken, Key? key}): super(key: key);
  final String accesstoken;
  @override
  Widget build(BuildContext context) {
    return Navigator(pages: [MaterialPage(child: SafeArea(child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Expanded(child: Padding(padding: const EdgeInsets.all(5),child: Card(child: InkWell(onTap: (){Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => SongPage(accesstoken: accesstoken)));}, child: Row(mainAxisAlignment: MainAxisAlignment.center, children: const [Padding(padding: EdgeInsets.all(10), child: Icon(Icons.accessibility_new_sharp, size: 40,),), Text("Songs for Me", textScaleFactor: 2,)],))))),
        Expanded(child: Padding(padding: const EdgeInsets.fromLTRB(5, 0, 5, 5), child: Card(child: InkWell(onTap: (){}, child: Row(mainAxisAlignment: MainAxisAlignment.center, children: const [Padding(padding: EdgeInsets.all(10), child: Icon(Icons.group, size: 40,),), Text("Songs for Us", textScaleFactor: 2,)],)))))
      ],
    )))]);
  }
}

class SongPage extends StatefulWidget {
  const SongPage({required this.accesstoken, Key? key}) : super(key: key);
  final String accesstoken;
  @override
  State<StatefulWidget> createState() {
    return _SongPageState();
  }
}

class _SongPageState extends State<SongPage>  {
  List<Map> songs = [];
  List<Widget> songTiles = [];

  void getRecs(BuildContext context) async  {
    List<Map> thingsToUse = songs.reversed.take(5).toList();
    List<String> songsToUse = [];
    List<String> genresToUse = [];
    List<String> artistToUse = [];
    for (Map thing in thingsToUse)  {
      if (thing["type"] == "artist")  {
        var body = {"artist": thing["data"]};
        var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/fetch/artist"), headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',}, body: jsonEncode(body));
        var artist = jsonDecode(response.body);
        artistToUse.add(artist["id"]);
      }
      else if (thing["type"] == "genre")  {
        genresToUse.add(thing["data"]);
      }
      else  {
        songsToUse.add(thing["data"]["id"]);
      }
    }
    var body = {"seed_tracks": songsToUse, "seed_genres": genresToUse, "seed_artists": artistToUse};
    var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/fetch/recs"), headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    }, body: jsonEncode(body));
    var songList = jsonDecode(response.body);
    Navigator.pop(context);
    Navigator.push(context, MaterialPageRoute<void>(builder: (BuildContext context) => PlaylistPage (usertoken: widget.accesstoken, songList: songList)));
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(appBar: AppBar(title: const Text("Songs for me"), centerTitle: true,),
        body: SafeArea(
        child: Column(mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Padding(padding: EdgeInsets.all(10), child: Text("Choose up to 5 songs, genres, or artists", style: TextStyle(fontSize: 18),)),
            Padding(padding: const EdgeInsets.all(10), child: SongSearch(onSelected:
              (Map thing) {
                setState(() {
                  if (thing["type"] == "song") {
                    if (thing["data"]["name"] != null) {
                      songs.add(thing);
                      songTiles.add(ListTile(title: Text(
                          "${thing["data"]["name"]} (${thing["data"]["artist"]})")));
                    }
                  }
                  else {
                    if (thing["type"] != null) {
                      songs.add(thing);
                      songTiles.add(
                          ListTile(title: Text(
                              "${thing["data"]} (${thing["type"]})"
                          ),)
                      );
                    }
                  }
                });
              }, accesstoken: widget.accesstoken,),),
            Expanded(child:
              ListView(children: songTiles,)
            ),
            Row(mainAxisAlignment: MainAxisAlignment.end, children: [
              Expanded(child: Padding(padding: const EdgeInsets.all(10), child: ElevatedButton(onPressed: () {getRecs(context);}, child: const Text("Go!")))),
            ],)
          ],
        )
    ));
  }

}

class SongEntry extends ListTile {
  SongEntry({required String artist, required String name, required String id, Key? key}) : super(title: Text("$name ($artist)"), onTap: (){}, key: key);
}

class PlaylistPage extends StatefulWidget {
  const PlaylistPage({required this.usertoken, required this.songList, Key? key}) : super(key: key);
  final String usertoken;
  final List songList;
  @override
  State<StatefulWidget> createState() => _PlaylistPageState();
}

class _PlaylistPageState extends State<PlaylistPage>  {
  @override
  Widget build(BuildContext context)  {
    return Scaffold(
      appBar: AppBar(title: const Text("Recommended Playlist:"), centerTitle: true),
      body: SafeArea(child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Expanded(child: ListView(
            padding: const EdgeInsets.all(10),
            children: widget.songList.map((e) => SongEntry(artist: e["artist"], name: e["name"], id: e["id"])).toList(),
          ))
        ],
        )
      )
    );
  }
}