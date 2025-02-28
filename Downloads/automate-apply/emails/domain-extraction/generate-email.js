function generateEmailFromFormat(name, emailFormatObj) {
  if (
    !name ||
    !emailFormatObj ||
    !emailFormatObj.email ||
    !emailFormatObj.format
  ) {
    console.log("Please provide a valid name and email format object.");
    return null;
  }

  const [firstName, lastName] = name.split(" ");

  if (!firstName) {
    console.log("Please provide a name with at least a first name.");
    return null;
  }

  // Extract domain from the provided email
  const domain = emailFormatObj.email.split("@")[1];

  let generatedEmail = emailFormatObj.format;

  // Replace placeholders
  if (generatedEmail.includes("last")) {
    if (lastName) {
      generatedEmail = generatedEmail.replace("[last]", lastName.toLowerCase());
    }
    return null;
  }
  generatedEmail = generatedEmail
    .replace("[first]", firstName.toLowerCase())
    .replace("[first_initial]", firstName.charAt(0).toLowerCase())
    .replace(
      "[last_initial]",
      lastName ? lastName.charAt(0).toLowerCase() : ""
    );

  return `${generatedEmail}@${domain}`;
}

// // Example usage
// const emailFormatObj = {
//   format: "[first].[last]",
//   email: "jane@chargebee.com",
//   percentage: 48.4,
// };
// const name = "Abhishek";

// const generatedEmail = generateEmailFromFormat(name, emailFormatObj);
// console.log("Generated Email:", generatedEmail);

export default generateEmailFromFormat