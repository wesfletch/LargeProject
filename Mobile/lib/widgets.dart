import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SongSearch extends StatefulWidget {
  const SongSearch({required this.accesstoken, required this.onSelected, Key? key}) : super(key: key);
  final String accesstoken;
  final Function(Map) onSelected;
  @override
  State<StatefulWidget> createState() {
    return _SongSeachState();
  }
}

class _SongSeachState extends State<SongSearch> {

  Iterable<String> _toDisplay = const Iterable<String>.empty();
  String prevdata = "";
  var songs = const Iterable.empty();
  List<String> genres = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b","rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"];

  void request(var data) async {
    String input = data["track"];
    var request = http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/fetch/track"), headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    }, body: jsonEncode(data));

    List<String> options = genres.map((e) => e + " (genre)").toList();

    var response = await request;

    options.addAll(List<String>.from(jsonDecode(response.body).map((e) => e["artist"] + " (artist)")).toSet().toList());
    options.addAll(List<String>.from(jsonDecode(response.body).map((x) => x["name"] + " (${x["artist"]})")));
    List<String> tracks = options.where((element) => element.toLowerCase().contains(input.toLowerCase())).toList();
    songs = jsonDecode(response.body);
    if (tracks.isEmpty) {
      setState(() {
        _toDisplay = const Iterable<String>.empty();
      });
    }
    else  {
      setState(() {
        _toDisplay = tracks;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Autocomplete<String>(
      optionsBuilder: (TextEditingValue input) {
        if (input.text == '') {
          return _toDisplay;
        }
        var data  = {"track": input.text};
        prevdata = input.text;
        request(data);
        return _toDisplay;
      },
      onSelected: (String? input) {
        if (input == null)  {

        }
        else  {
          print(input);
          Iterable<String> components = input.split(RegExp(r"\((?=\w+\)$)"));
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
          setState(() {
            widget.onSelected(toRet);
          });

        }
      },
    );
  }
}