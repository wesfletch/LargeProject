import 'dart:convert';

import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;
import 'dart:io';
import 'dart:async';
import 'package:flutter_typeahead/flutter_typeahead.dart';

class SongSearch extends StatefulWidget {
  const SongSearch({required this.accesstoken, required this.onSelected, this.findall = true, Key? key}) : super(key: key);
  final String accesstoken;
  final Function(Map) onSelected;
  final bool findall;
  @override
  State<StatefulWidget> createState() {
    return _SongSeachState();
  }
}

class _SongSeachState extends State<SongSearch> {

  Iterable<String> _toDisplay = const Iterable<String>.empty();
  String prevdata = "";
  bool init = false;
  bool done = false;
  var songs = [];
  Map<String, List> favorites = {"fav_artists": [], "fav_genres": [], "fav_tracks": []};
  List<String> genres = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music"
  ];

  void getFavorites() async  {
    var response = await http.get(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/getfavs"), headers: {"Cookie": 'access_token=${widget.accesstoken}', 'Content-Type': 'application/json; charset=UTF-8',},);
    var favMap = jsonDecode(response.body);
    favorites = Map<String, List>.from(favMap);

    setState(() {
      done = true;
    });
  }

  Future<List<String>> request(String data) async {
    // String input = data["track"];
    songs = [];
    if (data == "" && done) {
      List<String> options = [];
      if (widget.findall) {
        options.addAll(List<String>.from(favorites["fav_artists"]!).map((e) => "$e (artist)"));
        options.addAll(List<String>.from(favorites["fav_genres"]!).map((e) => "$e (genre)"));
      }
      options.addAll(List<String>.from(favorites["fav_tracks"]!).map((e) => "${jsonDecode(e)["name"]} (${jsonDecode(e)["artist"]})"));
      songs.addAll(favorites["fav_tracks"]!.map((e) => jsonDecode(e)));
      options.shuffle();
      return options;
    }
    var request = http.post(
        Uri.parse("https://poosd-f2021-11.herokuapp.com/fetch/track"),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        }, body: jsonEncode({"track": data}));
    List<String> options = [];
    if (widget.findall) {
      options.addAll(genres.map((e) => e + " (genre)").toList());
    }

    var response = await request;


    if (widget.findall) {
      options.addAll(List<String>.from(
          jsonDecode(response.body).map((e) => e["artist"] + " (artist)"))
          .toSet()
          .toList());
    }
    options.addAll(List<String>.from(
        jsonDecode(response.body).map((x) => x["name"] + " (${x["artist"]})")));
    List<String> tracks = options.where((element) =>
        element.toLowerCase().contains(data.toLowerCase())).toList();
    songs.addAll(jsonDecode(response.body));
    if (tracks.isEmpty) {
      setState(() {
        _toDisplay = const Iterable<String>.empty();
      });
    }
    else {
      setState(() {
        _toDisplay = tracks;
      });
    }
    return _toDisplay.toList();
  }

  @override
  Widget build(BuildContext context) {
    if (!init)  {
      getFavorites();
      init = true;
    }
    return TypeAheadField(
      textFieldConfiguration: const TextFieldConfiguration(
        autofocus: false,
        decoration: InputDecoration(
            border: OutlineInputBorder()
        ),
      ),
      suggestionsCallback: (pattern) async {
        return await request(pattern);
      },
      itemBuilder: (context, String suggestion) {
        return ListTile(
          title: Text(suggestion),
          trailing: widget.findall ? const Text("") : const Icon(Icons.add),
        );
      },
      onSuggestionSelected: (String suggestion) {
        print(suggestion);
        Iterable<String> components = suggestion.split(RegExp(r"\((?=[^)]+\)$)"));
        // Note: Song can be a genre, song, or artist, and artist can be an artist, the word artist, or the word genre.
        String song = components.elementAt(0).trimRight();
        String artist = components.elementAt(1).replaceAll(RegExp(r"\)$"), "");
        Map toRet = {};
        if (genres.contains(song.toLowerCase()) && artist == "genre") {
          toRet = {"type": "genre", "data": song};
        }
        else {
          for (Map track in songs) {
            if (track["artist"] == artist && track["name"] == song) {
              toRet = {"type": "song", "data": track};
              break;
            }
            else if (track["artist"] == song && "artist" == artist) {
              toRet = {"type": "artist", "data": track["artist"]};
              break;
            }
          }
        }
        widget.onSelected(toRet);
      },
      hideOnError: true,
    );
  }
}

