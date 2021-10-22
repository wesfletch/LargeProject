import 'package:flutter/material.dart';

class TextInlayPage extends StatefulWidget {
  const TextInlayPage({this.message = "", Key? key}) : super(key: key);
  final String message;
  @override
  State<StatefulWidget> createState() => _TextInlayPageState();
}

class _TextInlayPageState extends State<TextInlayPage>  {
  @override
  Widget build(BuildContext context) {
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