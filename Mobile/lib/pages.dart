import 'package:flutter/material.dart';
import 'inlay_pages.dart';
import 'package:fltr_test/utilities.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginPage extends StatelessWidget {
  const LoginPage(this.submitUsername, this.submitPassword, this.doLogin, this.loginFailed, {Key? key}) : super(key: key);

  final Function(String) submitUsername;
  final Function(String) submitPassword;
  final Function doLogin;
  final bool loginFailed;


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
                    Expanded(
                      child: Padding(padding: const EdgeInsets.fromLTRB(0, 0, 5, 0), child:
                      ElevatedButton(
                        onPressed: () {doLogin();},
                        child: const Text("Sign In", style: TextStyle(fontSize: 24)),
                      ),),
                    ),
                    Expanded(
                      child: Padding(padding: const EdgeInsets.fromLTRB(5, 0, 0, 0), child: ElevatedButton(
                        onPressed: () {Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => const RegistrationPage()));},
                        child: const Text("Register", style: TextStyle(fontSize: 24)),
                        style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Theme.of(context).scaffoldBackgroundColor), side: MaterialStateProperty.all(const BorderSide(width: 3.0, color: Colors.purple))),
                      ),
                    ),),
                  ],
                )
              ),
              Visibility(
                  child: const Padding(
                      padding: EdgeInsets.all(10),
                      child: SizedBox(width: 400, height: 50, child: Card(child: Center(child: Text("Login Failed!", style: TextStyle(fontSize: 20),)), color: Colors.redAccent,),)
                  ),
                visible: loginFailed,
              ),
            ],
          ),
          Column(mainAxisAlignment: MainAxisAlignment.end, children: [Row(children: [Expanded(
            child: Padding(
                padding: const EdgeInsets.all(10),
                child: ElevatedButton(onPressed: () {Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context) => const ForgotPasswordPage()));}, child: const Text("Forgot Password"), style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Theme.of(context).scaffoldBackgroundColor), side: MaterialStateProperty.all(const BorderSide(width: 3.0, color: Colors.purple))),)
            ),
          )]),]),
        ]),
      ),
    );
  }
}

class ForgotPasswordPage extends StatefulWidget  {
  const ForgotPasswordPage({Key? key}) : super(key: key);
  @override
  State<StatefulWidget> createState() {
    return _ForgotPasswordState();
  }
}

class _ForgotPasswordState extends State<ForgotPasswordPage>  {
  String email = "";

  void resetPassword(String email) async {
    // TODO: Send password reset request once apis are up.
    var body = {"email": email};
    var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/forgot"), headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    }, body: jsonEncode(body));
    print("here");
    print(response.toString());
    print(response.body);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Forgot Password"), centerTitle: true,),
      body: Column(mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(children: [Expanded(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: TextField(
                onChanged: (String input) {email = input;},
                decoration: const InputDecoration(
                  labelText: "Email",
                  hintText: "123@gmail.com",
                ),
              ),
            ),
          ),]),
          Row(children: [Expanded(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                onPressed: () {resetPassword(email);},
                child: const Text("Reset Password"),
              ),
            ),
          ),],),
        ],
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
  String _displayName = "";
  List<passwordErrors> _passwordErrors = isValidPassword("");
  String _registrationError = "";

  Future<int> register() async {
    var body = {"display_name": _displayName, "email": _username, "password": _password, "password2": _otherPassword};
    var response = await http.post(Uri.parse("https://poosd-f2021-11.herokuapp.com/users/register"), headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    }, body: jsonEncode(body));
    if (response.statusCode == 201) {
      return 0;
    }
    else if (response.statusCode == 400)  {
      return 1;
    }
    else  {
      return 2;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Register"), centerTitle: true,),
      body: SafeArea(
        child: Stack(children: [
          SingleChildScrollView(child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(children: [Expanded(child: Padding(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  onChanged: (String? a) {_username = a;},
                  decoration: const InputDecoration(
                    labelText: "Email",
                    hintText: "123@gmail.com",
                  ),
                  autofocus: true,
                ),
              )),]),
              Row(children: [Expanded(child: Padding(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  onChanged: (String a) {_displayName = a;},
                  decoration: const InputDecoration(
                    labelText: "Display Name",
                    hintText: "Joey Smith",
                  ),
                ),
              ),)]),
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
              Row(children: [Expanded(child: Padding(
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
              )),]),
              Row(children: [Expanded(child: Padding(
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
              ),)]),
              Padding(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            if (_passwordErrors.isEmpty && stringsMatch(_password, _otherPassword)) {
                              register().then((value) {
                                if (value == 0) {
                                  Navigator.pop(context);
                                  Navigator.push(context, MaterialPageRoute(builder: (BuildContext context) => const RegistrationSuccessfulPage()));
                                }
                                else if (value == 1)  {
                                  setState(() {
                                    _registrationError = "Error: Email already registered.";
                                  });
                                }
                                else {
                                  setState(() {
                                    _registrationError = "Unknown Registration error, please try again later.";
                                  });
                                }
                              });

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
          )),
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
      body: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Center(child: Padding(
          padding: const EdgeInsets.all(10),
          child: RichText(
            text: TextSpan(
                text: "Registration successful.\n\n Please watch for an email to confirm your email address.", style: Theme.of(context).textTheme.headline1), textAlign: TextAlign.center,
            )
          )
        ),
        Padding(padding: const EdgeInsets.all(10), child: SizedBox(height: 60, width: 500, child: ElevatedButton(onPressed: () {Navigator.pop(context);}, child: const Text("Return to Sign In", style: TextStyle(fontSize: 30),))))
      ])
    );
  }
}

class LandingPage extends StatefulWidget {
  const LandingPage({this.username = "", required this.usertoken, required this.logout, Key? key}) : super(key: key);
  final String username;
  final String usertoken;
  final Function(BuildContext) logout;
  @override
  State<StatefulWidget> createState() => _LandingPageState();

}

class _LandingPageState extends State<LandingPage>  {
  int page = 0;
  int prevpage = 0;
  Widget? nav1;
  Widget? nav2;
  bool init = false;

  @override
  Widget build(BuildContext context) {
    if (init == false) {
      init = true;
      nav1 = HomePage(accesstoken: widget.usertoken);
      nav2 = AccountPageList(usertoken: widget.usertoken, logout: widget.logout);
    }
    return Scaffold(
      body: page == 1 ? nav2 : nav1,
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

