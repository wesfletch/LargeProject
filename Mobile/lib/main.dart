
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
  @override
  void initState() {
    super.initState();
    _checkUserToken();
  }

  void _checkUserToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    // await prefs.clear();
    if (prefs.containsKey("userToken")) {
      setState(() {
        _userToken = prefs.getString("userToken");
        _loaded = true;
      });
      // Try to login, if no worko, set user token to null
      return;
    }
    setState(() {
      _loaded = true;
    });
  }

  void _login() {
    // Login here
    setState(() {
      _userToken = "abcd";
    });
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
        currPage = MaterialPage(child: LoginPage(_updateUsername, _updatePassword, _login));
      }
      else  {
        currPage = MaterialPage(child: LandingPage(username: _username,));
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
        ),
    );
  }
}