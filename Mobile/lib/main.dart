
import 'dart:convert';
import 'dart:io';


import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'pages.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(const RecsApp());

class RecsApp extends StatefulWidget {
  const RecsApp({Key? key}) : super(key: key);
  @override
  State<StatefulWidget> createState() => _RecsAppState();
}

class _RecsAppState extends State<RecsApp> {
  String? _userToken;
  bool _loaded = false;
  String _username = "";
  String _password = "";
  bool _loginFailed = false;

  @override
  void initState() {
    super.initState();
    _checkUserToken();
  }

  void logout(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    setState(() {
      _userToken = null;
      Navigator.of(context).pop();
    });
  }

  void _checkUserToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    // await prefs.clear();
    if (prefs.containsKey("userToken")) {
      _userToken = prefs.getString("userToken");
      _loaded = true;
      // Try to login, if no worko, set user token to null
      var response = await http.get(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/authenticated"), headers: {"Cookie": 'access_token=$_userToken'});
      if (response.statusCode != 200) {
        _userToken = null;
      }
    }
    else  {

    }
    setState(() {
      _loaded = true;
    });
  }


  void _login() async {
    // Login here
    var authentication = {"email": _username, "password": _password};
    var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/login"), body: authentication);
    if (response.statusCode == 200) {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      var body = jsonDecode(response.body);
      var sth = response.headers;
      var tkn = sth["set-cookie"]!.split('; ')[0].split("=")[1];
      setState(() {
        _userToken = tkn;
        _loginFailed = false;
        prefs.setString("userToken", tkn);
      });
    }
    else  {
      setState(() {
        _loginFailed = true;
      });
    }
  }

  void _updateUsername(String username) async {
    _username = username;
  }

  void _updatePassword(String password) async {
    _password = password;
  }

  @override
  Widget build(BuildContext context) {
    MaterialPage currPage;
    if (_loaded) {
      if (_userToken == null) {
        currPage = MaterialPage(child: LoginPage(_updateUsername, _updatePassword, _login, _loginFailed));
      }
      else  {
        currPage = MaterialPage(child: LandingPage(username: _username, usertoken: _userToken!, logout: logout));
      }
    }
    else  {
      currPage = const MaterialPage(child: WaitForLoginPage());
    }
    return MaterialApp(
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF171717),
        textTheme: const TextTheme(
          headline1: TextStyle(fontSize: 70, fontWeight: FontWeight.bold, color: Colors.white),
          bodyText1: TextStyle(fontSize: 14),
          headline2: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white)
        ),
        textSelectionTheme: TextSelectionThemeData(
          cursorColor: Colors.grey.shade300,
          selectionColor: Colors.purple,
          selectionHandleColor: Colors.purple,
        ),
        inputDecorationTheme: const InputDecorationTheme(
          enabledBorder: OutlineInputBorder(borderSide: BorderSide(width: 1.5, color: Colors.white38)),
          border: OutlineInputBorder(borderSide: BorderSide(width: 2.0)),
          focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.purple, width: 2.0)),
          floatingLabelStyle: TextStyle(color: Colors.purpleAccent),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(Colors.purple),
          )
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          selectedItemColor: Colors.purpleAccent,
          backgroundColor: Color(0xFF2a2a2a),
        ),
      ),
    title: 'Welcome to Flutter',
    home: Navigator(
          pages: [
            currPage,
          ],
      onPopPage: (route, result) {
          if (route.didPop(result)) {
            return true;
          }
          return false;
        },
      ),
    );
  }
}