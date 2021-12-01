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

  Iterable<String> toDisplay = const Iterable<String>.empty();
  String prevdata = "";
  var songs = const Iterable.empty();

  void request(var data) async {
    var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/fetch/track"), body: data);
    Iterable<String> tracks = List<String>.from(jsonDecode(response.body).map((x) => x["name"] + " (${x["artist"]})").toList());
    songs = jsonDecode(response.body);
    if (tracks.isEmpty) {
      setState(() {
        toDisplay = const Iterable<String>.empty();
      });
    }
    else  {
      setState(() {
        toDisplay = tracks;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Autocomplete<String>(
      optionsBuilder: (TextEditingValue input) {
        if (input.text == '' || input.text == prevdata) {
          return toDisplay;
        }
        var data  = {"track": input.text};
        prevdata = input.text;
        request(data);
        return toDisplay;
      },
      onSelected: (String? input) {
        if (input == null)  {

        }
        else  {
          Iterable<String> components = input.split(RegExp(r"\((?=\w+\)$)"));
          String song = components.elementAt(0).trimRight();
          String artist = components.elementAt(1).replaceAll(RegExp(r"\)$"), "");
          Map toRet = {};
          for (Map track in songs) {
            if (track["artist"] == artist && track["name"] == song) {
              toRet = track;
              break;
            }
          }
          widget.onSelected(toRet);
        }
      },
    );
  }
}