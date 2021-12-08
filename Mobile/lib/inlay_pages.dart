import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fltr_test/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:assets_audio_player/assets_audio_player.dart';

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
  SettingsEntry({required String text, required BuildContext context, required Widget page, Widget trailing = const Text(""), Function? onNavigate, Key? key}) : super(title: Text(text), trailing: trailing, onTap: (){Navigator.of(context).push(MaterialPageRoute(builder: (context) => page)); if (onNavigate != null)  {onNavigate();} }, key: key);
}


class PlaylistEntry extends StatefulWidget {
  const PlaylistEntry({required this.text, required this.delete, this.link = "", Key? key}) : super(key: key);
  final Icon icon_play = const Icon(Icons.play_arrow, color: Colors.purpleAccent,);
  final Icon icon_pause = const Icon(Icons.stop, color: Colors.purpleAccent);
  final String text;
  final String link;
  final Function delete;

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _PlaylistEntryState();
  }
}

class _PlaylistEntryState extends State<PlaylistEntry>  {
  bool playing = false;
  final player = AssetsAudioPlayer.withId("0");
  bool init = false;
  bool upForDeletion = false;

  void togglePlay() async {
    if (!init)  {
      await player.open(Audio.network(widget.link));
      init = true;
    }
    if (playing)  {
      await player.stop();
      setState(() {
        playing = false;
        init = false;
      });
    }
    else  {
      player.play();
      setState(() {
        playing = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return ListTile(
      title: Text(widget.text),
      onLongPress: () {setState(() {
        upForDeletion = !upForDeletion;
      }); },
      trailing: Visibility(child: InkWell(child: upForDeletion ? const Icon(Icons.delete) : (playing ? widget.icon_pause : widget.icon_play), onTap: () {if (upForDeletion) {setState(() {widget.delete();});} else {togglePlay();}},), visible: widget.link != "" || upForDeletion,),
    );
  }
}


class FavoritesPage extends StatefulWidget  {
  const FavoritesPage({required this.accesstoken, Key? key}) : super(key: key);

  final String accesstoken;

  @override
  State<StatefulWidget> createState() {
    return _FavoritesPageState();
  }
}

class _FavoritesPageState extends State<FavoritesPage>  {
  Map<String, List> favorites = {"fav_artists": [], "fav_genres": [], "fav_tracks": []};
  List<Widget> favoriteTiles = [];
  bool init = false;

  void getFavs(BuildContext context) async  {
    var response = await http.get(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/getfavs"), headers: {"Cookie": 'access_token=${widget.accesstoken}', 'Content-Type': 'application/json; charset=UTF-8',},);
    var favMap = jsonDecode(response.body);
    favorites = Map<String, List>.from(favMap);
    favoriteTiles = [];

    for (String name in favorites["fav_artists"]!) {
      favoriteTiles.add(ListTile(title: Text("$name (artist)"), trailing: InkWell(child: const Icon(Icons.delete), onTap: () {favorites["fav_artists"]!.remove(name); addFavs(context);},),));
    }
    for (String name in favorites["fav_genres"]!) {
      favoriteTiles.add(ListTile(title: Text("$name (genre)"), trailing: InkWell(child: const Icon(Icons.delete), onTap: () {favorites["fav_genres"]!.remove(name); addFavs(context);},),));
    }
    for (String nameArtist in favorites["fav_tracks"]!) {
      Map track = jsonDecode(nameArtist);
      String name = track["name"];
      String artist = track["artist"];
      favoriteTiles.add(ListTile(title: Text("$name ($artist)"), trailing: InkWell(child: const Icon(Icons.delete), onTap: () {favorites["fav_tracks"]!.remove(favorites["fav_tracks"]!.firstWhere((element) => element.contains(RegExp(name)))); addFavs(context);},),));
    }
    setState(() {
      init = true;
    });
  }

  Future<void> addFavs(BuildContext context) async  {
    var body = jsonEncode(favorites);
    var response = await http.put(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/update"), headers: {"Cookie": 'access_token=${widget.accesstoken}', 'Content-Type': 'application/json; charset=UTF-8',},
    body: body
    );
    getFavs(context);
    return showDialog<void>(context: context, barrierDismissible: false, builder: (BuildContext context) => AlertDialog(
      title: const Center(child: Text("Favorites Updated!")),
      actions: [TextButton(onPressed: () {Navigator.pop(context);}, child: const Text("Ok"))]
    ));

  }

  @override
  Widget build(BuildContext context) {
    if (!init)  {
      getFavs(context);
      return Scaffold(
        appBar: AppBar(title: const Text("Edit Favorites"), centerTitle: true,),
        body: const TextInlayPage(message: "Loading",),
      );
    }
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Favorites"), centerTitle: true,),
      body: Column(mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Padding(padding: EdgeInsets.fromLTRB(10, 15, 10, 10), child: Text("Add up to 5 favorite artists, genres, or songs.", style: TextStyle(fontSize: 17),)),
          Padding(padding: const EdgeInsets.all(10), child: SongSearch(onSelected:
              (Map thing) {
            setState(() {
              if (thing["type"] == "song") {
                favorites["fav_tracks"]!.add(jsonEncode(thing["data"]));
                String name = thing["data"]["name"];
                if (thing["data"]["name"] != null) {
                  favoriteTiles.add(ListTile(title: Text(
                    "${thing["data"]["name"]} (${thing["data"]["artist"]})"),
                    trailing: InkWell(child: const Icon(Icons.delete), onTap: () {favorites["fav_tracks"]!.remove(favorites["fav_tracks"]!.firstWhere((element) => element.contains(RegExp(name)))); addFavs(context);},),));
                }
              }
              else {
                if (thing["type"] != null) {
                  if (thing["type"] == "artist")  {
                    favorites["fav_artists"]!.add(thing["data"]);
                    String name = thing["data"];
                    favoriteTiles.add(
                      ListTile(title: Text(
                          "${thing["data"]} (${thing["type"]})"
                      ),trailing: InkWell(child: const Icon(Icons.delete), onTap: () {favorites["fav_artists"]!.remove(name); addFavs(context);},),)
                  );
                  }
                  else  {
                    favorites["fav_genres"]!.add(thing["data"]);
                    String name = thing["data"];
                    favoriteTiles.add(
                        ListTile(title: Text(
                            "${thing["data"]} (${thing["type"]})"
                        ),trailing: InkWell(child: const Icon(Icons.delete), onTap: () {favorites["fav_genres"]!.remove(name); addFavs(context);},),)
                    );
                  }

                }
              }
            });
          }, accesstoken: widget.accesstoken,),),
          Expanded(child:
            ListView(children: favoriteTiles,)
          ),
          Row(children: [Expanded(child: Padding(padding: const EdgeInsets.all(10), child: ElevatedButton(child: const Text("Save"), onPressed: () {addFavs(context);},),))],)
        ],
      ),
    );
  }
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
            SettingsEntry(text: "Playlists", context: context, page: PlaylistListPage(accesstoken: widget.usertoken)),
            SettingsEntry(text: "Friends", context: context, page: FriendsPage(usertoken: widget.usertoken)),
            SettingsEntry(text: "Edit Favorites", context: context, page: FavoritesPage(accesstoken: widget.usertoken)),
            SettingsEntry(text: "Logout", context: context, page: LogoutPage(message: "Logged out successfully.", logout: widget.logout))
          ],
        ))
      ],)))]
    );
  }
}

class ChangePlaylistNamePage extends StatefulWidget {
  const ChangePlaylistNamePage({required this.usertoken, required this.name, required this.id, required this.pl, Key? key}) : super(key: key);
  final String usertoken;
  final String name;
  final String id;
  final String pl;
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _ChangePlaylistNamePageState();
  }
}

class _ChangePlaylistNamePageState extends State<ChangePlaylistNamePage>  {
  void changeName(BuildContext context) async {
    Map mutablePlaylist = jsonDecode(widget.pl);
    mutablePlaylist["name"] = newName;
    var response = await http.put(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/playlist/${widget.id}"), headers: {"Cookie": 'access_token=${widget.usertoken}', 'Content-Type': 'application/json; charset=UTF-8',},
    body: jsonEncode(mutablePlaylist));
    Navigator.pop(context);
    Navigator.pop(context);
    Navigator.pop(context);
  }

  String newName = "";
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(title: const Text("Change Playlist Name"), centerTitle: true,),
      body: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        TextFormField(autofocus: true, onChanged: (String input) {newName = input;}, decoration: const InputDecoration(labelText: "Edit Playlist Name", hintText: "My Playlist 1"), initialValue: widget.name,),
        Row(children: [Expanded(child: ElevatedButton(child: const Text("Change Name"), onPressed: () {changeName(context);},))],),
      ],),
    );
  }
}

class Playlist extends StatefulWidget {
  const Playlist({required this.usertoken, required this.name, required this.id, Key? key}) : super(key: key);
  final String usertoken;
  final String name;
  final String id;
  @override
  State<StatefulWidget> createState() => _PlaylistState();
}

class _PlaylistState extends State<Playlist>  {
  bool init = false;
  List<Map> songs = [];
  Map<dynamic, dynamic> playlist = {};

  void getSongs() async {
    // TODO: Fix this when endpoint fixed.
    var response = await http.get(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/playlist/${widget.id}"), headers: {"Cookie": 'access_token=${widget.usertoken}', 'Content-Type': 'application/json; charset=UTF-8',},);
    // print(response.body);
    var songs = jsonDecode(response.body)["playlist"]["songs"];
    playlist = jsonDecode(response.body)["playlist"];
    // String toAddToUrl = "?";
    // for (String id in songs)  {
    //   toAddToUrl += "songs=$id&";
    // }
    // toAddToUrl = toAddToUrl.substring(0, toAddToUrl.length - 1);

    var response2 = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/fetch/trackinfo"), headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: jsonEncode(songs)
    );
    print(response2.body);
    var tracks = jsonDecode(response2.body);
    this.songs = [];
    this.songs.addAll(List<Map>.from(tracks));
    this.songs.addAll(List<Map>.from(jsonDecode(response.body)["playlist"]["tracks"]));
    setState(() {
      init = true;
    });
  }

  void delete(Map toDelete) async {
    print(playlist);
    if (playlist["songs"].any((e) => e == toDelete["id"])) {
      playlist["songs"].removeWhere((e) => e == toDelete["id"]);
    }
    else  {
      playlist["tracks"].removeWhere((e) => e["id"] == toDelete["id"]);
    }

    var response = await http.put(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/playlist/${widget.id}"), headers: {"Cookie": 'access_token=${widget.usertoken}', 'Content-Type': 'application/json; charset=UTF-8',},
        body: jsonEncode(playlist));

    getSongs();
  }

  @override
  Widget build(BuildContext context)  {
    if (init == false)  {
      getSongs();
      return Scaffold(
        appBar: AppBar(title: Text(widget.name), centerTitle: true),
        body: const TextInlayPage(message: "Loading...",),
      );
    }
    return Scaffold(
      appBar: AppBar(title: Text(widget.name), centerTitle: true, actions: [TextButton(onPressed: () {Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => AddSongToPlaylistPage(accesstoken: widget.usertoken, playlistID: widget.id, reload: getSongs)));}, child: const Icon(Icons.add, color: Colors.white,))],),
      body: SafeArea(child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Expanded(child: ListView(
            padding: const EdgeInsets.all(10),
            children: songs.map((e) => PlaylistEntry(text: "${e["name"]} (${e["artist"]})", delete: () {delete(e);}, link: e["preview"] ?? "")).toList(),
          )),
          Row(children: [Expanded(child: Padding(padding: const EdgeInsets.all(10), child: ElevatedButton(onPressed: () {Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => ChangePlaylistNamePage(usertoken: widget.usertoken, name: widget.name, id: widget.id, pl: jsonEncode(playlist))));}, child: const Text("Edit Playlist Name"))))]),
      ],)));
  }
}

class AddSongToPlaylistPage extends StatefulWidget  {
  const AddSongToPlaylistPage({required this.accesstoken, required this.playlistID, required this.reload, Key? key}) : super(key: key);
  final String accesstoken;
  final Function reload;
  final String playlistID;

  @override
  State<StatefulWidget> createState() {
    return _AddSongToPlaylistPageState();
  }
}

class _AddSongToPlaylistPageState extends State<AddSongToPlaylistPage>  {
  Map toAdd = {};

  void addToPlaylist(BuildContext context) async {
    var body = jsonEncode({"playlist_id": widget.playlistID, "tracks": [toAdd["data"]]});
    var response = await http.put(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/addtrack"), headers: {"Cookie": 'access_token=${widget.accesstoken}', 'Content-Type': 'application/json; charset=UTF-8',},
        body: body
    );
    print(response.body);
    widget.reload();
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Add song to Playlist"), centerTitle: true,),
      body: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        SongSearch(accesstoken: widget.accesstoken, findall: false, onSelected:
          (Map thing) {
            toAdd = thing;
            addToPlaylist(context);
        }),
      ],),
    );
  }
}

class PlaylistListPage extends StatefulWidget {
  const PlaylistListPage({required this.accesstoken, Key? key}) : super(key: key);

  final String accesstoken;

  @override
  State<StatefulWidget> createState() {
    return _PlaylistListPageState();
  }
}

class _PlaylistListPageState extends State<PlaylistListPage>  {

  bool init = false;

  List<Map>? playlists;
  List<Widget>? playlistWidgets;

  void onDelete(Map playlist) async {
    var response = await http.delete(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/playlist/${playlist["_id"]}"), headers: {"Cookie": 'access_token=${widget.accesstoken}', 'Content-Type': 'application/json; charset=UTF-8',},);
    getPlaylists();
  }

  void getPlaylists() async {
    var response = await http.get(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/playlists"), headers: {"Cookie": 'access_token=${widget.accesstoken}', 'Content-Type': 'application/json; charset=UTF-8',},);


    List<Map> gotPlaylists = List<Map>.from(jsonDecode(response.body)["playlists"]);
    playlists = gotPlaylists;
    List<Widget> playlistWidgetsa = [];
    for (Map playlist in playlists!) {
      playlistWidgetsa.add(SettingsEntry(text: playlist["name"],
          context: context,
          trailing: InkWell(onTap: () {onDelete(playlist);}, child: const Icon(Icons.delete, size: 20,),),
          page: Playlist(
            usertoken: widget.accesstoken, id: playlist["_id"], name: playlist["name"]),
      ));

    }
    playlistWidgets = playlistWidgetsa;
    setState(() {
      init = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!init || playlists == null || playlistWidgets == null)  {
      getPlaylists();
      return const TextInlayPage(message: "Playlists loading...");
    }
    else if (playlists!.isEmpty)  {
      return Scaffold(
        appBar: AppBar(title: const Text("Playlists"), centerTitle: true,),
        body: const TextInlayPage(message: "No Playlists!",),
      );
    }
    return Scaffold(
      appBar: AppBar(title: const Text("Playlists"), centerTitle: true),
      body: Navigator(pages: [MaterialPage(child: SafeArea(child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Expanded(child: ListView(
            padding: const EdgeInsets.all(10),
            children: List<Widget>.from(playlistWidgets!)
          ))
        ],)))]
      ),
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
    Iterable<String> components = friend.split(RegExp(r"\((?=[^)]+\)$)"));
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
        Expanded(child: Padding(padding: const EdgeInsets.fromLTRB(5, 0, 5, 5), child: Card(child: InkWell(onTap: (){Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => GroupRecsPage(accesstoken: accesstoken)));}, child: Row(mainAxisAlignment: MainAxisAlignment.center, children: const [Padding(padding: EdgeInsets.all(10), child: Icon(Icons.group, size: 40,),), Text("Songs for Us", textScaleFactor: 2,)],)))))
      ],
    )))]);
  }
}

class GroupRecsPage extends StatefulWidget  {
  const GroupRecsPage({required this.accesstoken, Key? key}) : super(key: key);

  final String accesstoken;

  @override
  State<StatefulWidget> createState() {
    return _GroupRecsPageState();
  }
}

class _GroupRecsPageState extends State<GroupRecsPage>  {

  List<Map> friends = [];

  bool init = false;

  void getFriends() async {

    var response = await http.get(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/friends"), headers: {"Cookie": 'access_token=${widget.accesstoken}', 'Content-Type': 'application/json; charset=UTF-8',},);

    friends.addAll(List<Map>.from(jsonDecode(response.body)["friends"]));

    setState(() {
      init = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build

    if (init == false)  {
      getFriends();
      return Scaffold(
        appBar: AppBar(title: const Text("Songs for Us"), centerTitle: true,),
        body: const TextInlayPage(message: "Loading..."),
      );
    }
    else if (friends.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text("Songs for Us"), centerTitle: true,),
        body: const Center(child: Text("Error: No friends to make recommendations with!", style: TextStyle(fontSize: 30), textAlign: TextAlign.center,)),
      );
    }
    return Scaffold(
      appBar: AppBar(title: const Text("Songs for Us"), centerTitle: true,),
      body: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Padding(padding: EdgeInsets.fromLTRB(10, 15, 10, 10), child: Text("Choose a friend to get group suggestions:", style: TextStyle(fontSize: 18), textAlign: TextAlign.center,),),
        Expanded(
          child: ListView(
            children: friends.map((e) => SettingsEntry(text: e["display_name"], context: context, page: RecWithFriendPage(accesstoken: widget.accesstoken, friend: e,))).toList(),
          ),
        ),])
    );
  }
}

class RecWithFriendPage extends StatefulWidget  {
  const RecWithFriendPage({required this.accesstoken, required this.friend, Key? key}) : super(key: key);

  final String accesstoken;
  final Map friend;

  @override
  State<StatefulWidget> createState() {
    return _RecWithFriendPageState();
  }
}

// for (Map thing in thingsToUse)  {
//   if (thing["type"] == "artist")  {
//   var body = {"artist": thing["data"]};
//   var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/fetch/artist"), headers: <String, String>{
//   'Content-Type': 'application/json; charset=UTF-8',}, body: jsonEncode(body));
//   var artist = jsonDecode(response.body);
//   artistToUse.add(artist["id"]);
//   }
//   else if (thing["type"] == "genre")  {
//   genresToUse.add(thing["data"]);
//   }
//   else  {
//   songsToUse.add(thing["data"]["id"]);
//   }
// }

class _RecWithFriendPageState extends State<RecWithFriendPage>  {

  List<Map> seeds = [];
  List<Widget> seedTiles = [];

  void getRecs(BuildContext context) async  {
    List<String> friend_genres = List<String>.from(widget.friend['fav_genres']);
    List<String> friend_artists = List<String>.from(widget.friend["fav_artists"]);
    List<String> friend_tracks = List<String>.from(widget.friend["fav_tracks"]);

    List<Map> friend_seeds = [];
    print(friend_tracks);
    friend_seeds.addAll(friend_genres.map((e) => {"type": "genre", "data": e}));
    friend_seeds.addAll(friend_artists.map((e) => {"type": "artist", "data": e}));
    friend_seeds.addAll(friend_tracks.map((e) => {"type": "track", "data": jsonDecode(e)}));

    friend_seeds.shuffle();
    List<Map> toUse = friend_seeds.take(2).toList();
    toUse.addAll(seeds.reversed);
    List<Map> toGetRecs = toUse.take(5).toList();

    List<String> songsToUse = [];
    List<String> genresToUse = [];
    List<String> artistToUse = [];
    for (Map thing in toGetRecs)  {
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
    Navigator.push(context, MaterialPageRoute<void>(builder: (BuildContext context) => PlaylistPage (usertoken: widget.accesstoken, name: "Made with ${widget.friend["display_name"]}", friend: widget.friend["email"],songList: songList)));
  }

  @override
  Widget build(BuildContext context) {
    print(widget.friend);
    return Scaffold(
      appBar: AppBar(title: Text("Recommendations with ${widget.friend["display_name"]}"), centerTitle: true,),
      body: Column(mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Padding(padding: EdgeInsets.fromLTRB(10, 15, 10, 10), child: Text("Choose songs, artists, or genres you like", style: TextStyle(fontSize: 18), textAlign: TextAlign.center,),),
          Padding(padding: const EdgeInsets.all(10), child: SongSearch(accesstoken: widget.accesstoken, onSelected: (Map selection)  {
            setState(() {
              if (selection["type"] == "song") {
                if (selection["data"]["name"] != null) {
                  seeds.add(selection);
                  seedTiles.add(ListTile(title: Text(
                      "${selection["data"]["name"]} (${selection["data"]["artist"]})")));
                }
              }
              else {
                if (selection["type"] != null) {
                  seeds.add(selection);
                  seedTiles.add(
                      ListTile(title: Text(
                          "${selection["data"]} (${selection["type"]})"
                      ),)
                  );
                }
              }
            });
          }),),
          Expanded(child:
            ListView(children: seedTiles,)
          ),
          Row(mainAxisAlignment: MainAxisAlignment.end, children: [
            Expanded(child: Padding(padding: const EdgeInsets.all(10), child: ElevatedButton(onPressed: () {getRecs(context);}, child: const Text("Go!")))),
          ],)
        ],
      ),
    );
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
  const PlaylistPage({required this.usertoken, this.name = "Solo Playlist", this.friend = "", required this.songList, Key? key}) : super(key: key);
  final String usertoken;
  final List songList;
  final String friend;
  final String name;
  @override
  State<StatefulWidget> createState() => _PlaylistPageState();
}

class _PlaylistPageState extends State<PlaylistPage>  {
  Future<void> savePlaylist(BuildContext context) async {
    var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/addplaylist"), headers: {"Cookie": 'access_token=${widget.usertoken}', 'Content-Type': 'application/json; charset=UTF-8',},
        body: jsonEncode({"name": widget.name, "friend": "", "songs": widget.songList.map((e) => e["id"]).toList()}));
    return showDialog<void>(context: context, barrierDismissible: false, builder: (BuildContext context) {
      return AlertDialog(
        title: const Center(child: Text("Playlist Created!")),
        content: const Text("To view playlists, go to profile page."),
        actions: [TextButton(onPressed: () {Navigator.pop(context);}, child: const Text("Ok"))],
      );
    });
  }

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
          )),
          Row(children: [
            Expanded(
              child: Padding(padding: const EdgeInsets.all(10), child: ElevatedButton(child: const Text("Save Playlist"), onPressed: () {savePlaylist(context);},))
            ),
          ],),
        ],
        )
      )
    );
  }
}