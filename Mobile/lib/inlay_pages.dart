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
  const LogoutPage({this.message = "", this.logout, Key? key}) : super(key: key);
  final String message;
  final Function? logout;
  @override
  State<StatefulWidget> createState() => _LogoutPageState();
}

class _LogoutPageState extends State<LogoutPage>  {
  @override
  Widget build(BuildContext context) {
    return Column(mainAxisAlignment: MainAxisAlignment.center, children: [Center(
      child: RichText(
        textAlign: TextAlign.center,
        text: TextSpan(
          text: widget.message,
          style: Theme.of(context).textTheme.headline1,
        ),
      ),
    ),
      Center(
        child: Expanded(
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: ElevatedButton(onPressed: () {widget.logout!(); }, child: const Text("Back to Sign In", style: TextStyle(fontSize: 20),),)
          ),
        ),
      )
    ]);
  }
}

class SettingsEntry extends ListTile {
  SettingsEntry({required String text, required BuildContext context, required Widget page, Key? key}) : super(title: Text(text), onTap: (){Navigator.of(context).push(MaterialPageRoute(builder: (context) => page));}, key: key);
}

class AccountPageList extends StatefulWidget {
  const AccountPageList({required this.usertoken, this.logout, Key? key}) : super(key: key);
  final Function? logout;
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
  FriendEntry({required String name, Key? key}) : super(title: Text("$name"), onTap: (){}, key: key);
}

class FriendsPage extends StatefulWidget  {
  FriendsPage({required this.usertoken, Key? key}) : super(key: key);

  final String usertoken;



  @override
  State<StatefulWidget> createState() => _FriendsPageState();
}

class _FriendsPageState extends State<FriendsPage>  {
  List<Widget> friendsEntries = [];
  List<String> friends = [];
  void addFriend(String friend) {
    setState(() {
      friends.add(friend);
      friendsEntries.add(FriendEntry(name: friend));
    });
  }

  void getFriends() async {
    // TODO: Load initial friends list
  }

  @override
  Widget build(BuildContext context)  {
    return Scaffold(
      appBar: AppBar(title: const Text("Friends"), centerTitle: true, actions: [IconButton(onPressed: (){Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => AddFriendPage(usertoken: widget.usertoken, addFriend: addFriend)));}, icon: const Icon(Icons.add))],),
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
            Row(children: [Expanded(child: Padding(padding: const EdgeInsets.all(10), child: ElevatedButton(child: const Text("Hello"), onPressed: () {addFriend(_toAdd);},))),]),
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
    var songsToUse = songs.take(5).toList().map((e) => e["id"]).toList();
    var body = {"seed_tracks": songsToUse, "seed_genres": [], "seed_artists": []};
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
    return Scaffold(body: SafeArea(
        child: Column(mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Padding(padding: EdgeInsets.all(10), child: Text("Choose up to 5 songs.", style: TextStyle(fontSize: 20),)),
            Padding(padding: const EdgeInsets.all(10), child: SongSearch(onSelected: (Map thing) {setState(() {if (thing["name"] != null) {songs.add(thing); songTiles.add(ListTile(title: Text("${thing["name"]} (${thing["artist"]})")));}});}, accesstoken: widget.accesstoken,),),
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