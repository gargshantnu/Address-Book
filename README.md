# Address Book CLI Application

This is a Command Line Interface (CLI) based address book application written in JavaScript. The application allows you to manage contacts, perform searches, and store data persistently.

## Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/address-book-cli.git
```

2. Navigate to the project directory:

```
cd address-book-cli
```

3. Install dependencies:

```
npm install
```

## Usage

### Import Contacts from CSV

To import contacts from a CSV file, use the following command:

```
node app.js import --file path/to/your/contacts.csv
```

Replace `path/to/your/contacts.csv` with the actual path to your CSV file.

### Search for Contacts

To search for a contact, you can use the search command. You can search by name or phone number.

Search by Name:

```
node app.js search --name John
```

Replace John with the name you want to search for.

Search by Phone Number:

```
node app.js search --phone 555-1234
```

Replace `555-1234` with the phone number you want to search for.


#### Important Notes

- Contacts are stored persistently in a file named `addressBookData.json`.
- Ensure that you have the necessary permissions to read/write files in the application directory.



### Data Structure

The application uses a Trie data structure to efficiently store and retrieve contacts based on names and phone numbers.

- `Contact` class represents an individual contact.
- `TrieNode` class represents a node in the Trie data structure.
- `AddressBook` class manages the overall address book functionality.

## Development and Extension

The application is designed to be extendable and follows proper design patterns. You can modify and extend the functionality according to your requirements.

- Add new features to the `AddressBook` class.
- Implement additional search criteria or filters.
- Extend the data storage mechanism.

## Troubleshooting
If you encounter any issues or errors, check the following:

- Ensure the CSV file is in the correct format and contains valid data.
- Verify that the file paths provided in commands are correct.
- Check for any error messages in the console output.


Feel free to customize and enhance the application based on your needs. Happy coding!
