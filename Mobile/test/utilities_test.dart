import 'package:flutter_test/flutter_test.dart';
import 'package:fltr_test/utilities.dart';

void main() {
  group("Password Checker", ()  {
    test("password should be checked for special characters", ()  {
      List<passwordErrors> errors = isValidPassword("Welcome1");
      expect(errors.contains(passwordErrors.noSpecial), true);
    });
    test("password should be checked for uppercase characters", ()  {
      List<passwordErrors> errors = isValidPassword("welcome1_");
      expect(errors.contains(passwordErrors.noUpper), true);
    });
    test("password should be checked for numbers", ()  {
      List<passwordErrors> errors = isValidPassword("Welcome_");
      expect(errors.contains(passwordErrors.noNumber), true);
    });
    test("password should be checked for lowercase characters", ()  {
      List<passwordErrors> errors = isValidPassword("W_1JIOAEFTJOI");
      expect(errors.contains(passwordErrors.noLower), true);
    });
    test("password should be checked for length of >= 8 characters", ()  {
      List<passwordErrors> errors = isValidPassword("W_1w");
      expect(errors.contains(passwordErrors.tooShort), true);
    });
    test("passwords should be checked for equality, '' should always make the function return false", ()  {
      expect(stringsMatch("welcome", "welcome"), true);
      expect(stringsMatch("", ""), false);
      expect(stringsMatch("asjdfpoakdf", "fdjsdfjodisf"), false);
    });
  });
}