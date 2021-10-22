import 'package:flutter/material.dart';
import 'inlay_pages.dart';

class LoginPage extends StatelessWidget {
  const LoginPage(this.submitUsername, this.submitPassword, this.doLogin, {Key? key}) : super(key: key);

  final Function(String) submitUsername;
  final Function(String) submitPassword;
  final Function doLogin;


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Stack(children: [
          Column(
              children: [Center(child: Padding(
                  padding: const EdgeInsets.fromLTRB(10, 40, 10, 10),
                  child: RichText(
                      text: TextSpan(
                          text: "<appname>",
                          style: Theme.of(context).textTheme.headline2))))]),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Center(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(0, 10, 0, 20),
                  child: RichText(
                    text: TextSpan(
                      text: "Sign In",
                      style: Theme.of(context).textTheme.headline1,
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  onChanged: submitUsername,
                  decoration: const InputDecoration(
                    labelText: "Username",
                    hintText: "123@gmail.com",
                  ),
                  autofocus: true,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                child: TextField(
                  onChanged: submitPassword,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: "Password",
                    hintText: "Enter password here",
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: SizedBox(
                  width: 400,
                  height: 40,
                  child:
                    ElevatedButton(
                      onPressed: () {doLogin();},
                      child: const Text("Sign In", style: TextStyle(fontSize: 24)),
                    ),
                )
              )
            ],
          ),
        ]),
      ),
    );
  }
}

class LandingPage extends StatefulWidget {
  const LandingPage({this.username = "", Key? key}) : super(key: key);
  final String username;
  @override
  State<StatefulWidget> createState() => _LandingPageState();

}

class _LandingPageState extends State<LandingPage>  {
  int page = 0;

  @override
  Widget build(BuildContext context) {
    Widget body;
    if (page == 0)  {
      body = TextInlayPage(message: "Welcome, " + widget.username);
    }
    else if (page == 1) {
      body = const TextInlayPage(message: "This is the settings page.");
    }
    else  {
      body = const TextInlayPage(message: "Blah");
    }
    return Scaffold(
      body: body,
      bottomNavigationBar: BottomNavigationBar(
        onTap: (int pageIndex) {setState(() {
          page = pageIndex;
        });},
        currentIndex: page,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
          BottomNavigationBarItem(icon: Icon(Icons.settings_rounded), label: "Settings")
        ],
      ),
    );
  }
}

class WaitForLoginPage extends StatelessWidget {
  const WaitForLoginPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Center(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(0, 0, 0, 0),
                child: RichText(
                  text: TextSpan(
                    text: "Logging in...",
                    style: Theme.of(context).textTheme.headline1,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
