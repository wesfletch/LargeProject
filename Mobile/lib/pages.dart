import 'package:flutter/material.dart';
import 'inlay_pages.dart';
import 'package:fltr_test/utilities.dart';

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
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    SizedBox(
                      width: 400,
                      height: 40,
                      child: ElevatedButton(
                        onPressed: () {doLogin();},
                        child: const Text("Sign In", style: TextStyle(fontSize: 24)),
                      ),
                    ),
                    SizedBox(
                      width: 400,
                      height: 40,
                      child: ElevatedButton(
                        onPressed: () {Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => const RegistrationPage()));},
                        child: const Text("Register", style: TextStyle(fontSize: 24)),
                        style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Theme.of(context).scaffoldBackgroundColor), side: MaterialStateProperty.all(const BorderSide(width: 3.0, color: Colors.purple))),
                      ),
                    ),
                  ],
                )
              )
            ],
          ),
        ]),
      ),
    );
  }
}

class RegistrationPage extends StatefulWidget  {
  const RegistrationPage({Key? key}): super(key: key);
  @override State<StatefulWidget> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage>  {
  String? _password;
  String? _username;
  String? _otherPassword;
  List<passwordErrors> _passwordErrors = isValidPassword("");
  String _registrationError = "";

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
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
                      text: "Register",
                      style: Theme.of(context).textTheme.headline1,
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  onChanged: (String? a) {_username = a;},
                  decoration: const InputDecoration(
                    labelText: "Email",
                    hintText: "123@gmail.com",
                  ),
                  autofocus: true,
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                    children: [
                      Row(children: const [Text("Password Requirements:")]),
                      Padding(child: Column(
                        children: [
                          Row(children: [Icon(_passwordErrors.contains(passwordErrors.tooShort)? Icons.clear : Icons.check, color: _passwordErrors.contains(passwordErrors.tooShort)? Colors.red : Colors.green), const Text("Password length is 8 characters or more")]),
                          Row(children: [Icon(_passwordErrors.contains(passwordErrors.noUpper)? Icons.clear : Icons.check, color: _passwordErrors.contains(passwordErrors.noUpper)? Colors.red : Colors.green), const Text("Password contains at least 1 uppercase character")]),
                          Row(children: [Icon(_passwordErrors.contains(passwordErrors.noLower)? Icons.clear : Icons.check, color: _passwordErrors.contains(passwordErrors.noLower)? Colors.red : Colors.green), const Text("Password contains at least 1 lowercase character")]),
                          Row(children: [Icon(_passwordErrors.contains(passwordErrors.noNumber)? Icons.clear : Icons.check, color: _passwordErrors.contains(passwordErrors.noNumber)? Colors.red : Colors.green), const Text("Password contains at least 1 number")]),
                          Row(children: [Icon(_passwordErrors.contains(passwordErrors.noSpecial)? Icons.clear : Icons.check, color: _passwordErrors.contains(passwordErrors.noSpecial)? Colors.red : Colors.green), const Text("Password contains at least 1 special character")]),
                          Row(children: [Icon(stringsMatch(_password, _otherPassword)? Icons.check : Icons.clear, color: stringsMatch(_password, _otherPassword) ? Colors.green : Colors.red), const Text("Passwords match")]),
                        ],
                      ), padding: const EdgeInsets.fromLTRB(10, 10, 0, 0),)
                    ]
                )
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                child: TextField(
                  onChanged: (String? a) {setState(() {
                    _password = a;
                    _passwordErrors = isValidPassword(a);
                  });},
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: "Password",
                    hintText: "Enter password here",
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                child: TextField(
                  onChanged: (String? a) {setState(() {
                    _otherPassword = a;
                  });},
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: "Enter password again",
                    hintText: "Enter password again",
                  ),
                ),
              ),
              Padding(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      SizedBox(
                        width: 400,
                        height: 40,
                        child: ElevatedButton(
                          onPressed: () {
                            if (_passwordErrors.isEmpty && stringsMatch(_password, _otherPassword)) {
                              // TODO: Register
                              Navigator.pop(context);
                              Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => const RegistrationSuccessfulPage()));
                            }
                            else  {
                              setState(() {
                                _registrationError = "Error: Please ensure your password meets all password requirements";
                              });
                            }
                          },
                          child: const Text("Register", style: TextStyle(fontSize: 24)),
                        ),
                      ),
                    ],
                  )
              ),
              _registrationError.isNotEmpty ? Padding(
                padding: const EdgeInsets.all(10),
                child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [const Icon(Icons.clear, color: Colors.red,), Text(_registrationError)],),
              ) : const Text(""),
            ],
          ),
        ]),
      ),
    );
  }
}

class RegistrationSuccessfulPage extends StatelessWidget  {
  const RegistrationSuccessfulPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Padding(padding: EdgeInsets.all(10), child: RichText(text: TextSpan(text: "Registration successful. Please watch for an email to confirm your email address.", style: Theme.of(context).textTheme.headline1), textAlign: TextAlign.center,))),
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
