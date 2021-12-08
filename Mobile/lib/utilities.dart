
// Checks that password contains: 1 upper, 1 lower, 1 number, and 1 special character

enum passwordErrors {
  tooShort,
  noUpper,
  noLower,
  noNumber,
  noSpecial,
}

List<passwordErrors> isValidPassword(String? s)  {
  s ??= "";
  RegExp upper = RegExp(r"[A-Z]");
  RegExp lower = RegExp(r"[a-z]");
  RegExp number = RegExp(r"[0-9]");
  RegExp special = RegExp(r"[^A-Za-z0-9]");
  List<passwordErrors> errors = List.empty(growable: true);
  if (s.length < 8) {
    errors.add(passwordErrors.tooShort);
  }
  if (!s.contains(upper)) {
    errors.add(passwordErrors.noUpper);
  }
  if (!s.contains(lower)) {
    errors.add(passwordErrors.noLower);
  }
  if (!s.contains(number))  {
    errors.add(passwordErrors.noNumber);
  }
  if (!s.contains(special)) {
    errors.add(passwordErrors.noSpecial);
  }

  return errors;
}

bool stringsMatch(String? a, String? b) {
  a ??= "";
  b ??= "";
  if (a.compareTo("") == 0 || b.compareTo("") == 0) {
    return false;
  }
  else  {
    return a.compareTo(b) == 0;
  }
}