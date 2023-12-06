const fs = require("fs");
const csv = require("csv-parser");
const yargs = require("yargs");

class Contact {
    constructor(firstName, lastName, address, phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }
}

class TrieNode {
    constructor() {
        this.children = {};
        this.contacts = [];
    }
}

class AddressBook {
    constructor() {
        this.rootName = new TrieNode();
        this.rootPhoneNumber = new TrieNode();
    }

    addContact(contact) {
        this._addToTrie(
            this.rootName,
            contact.firstName.toLowerCase(),
            contact
        );
        this._addToTrie(this.rootName, contact.lastName.toLowerCase(), contact);
        this._addToTrie(this.rootPhoneNumber, contact.phoneNumber, contact);
    }

    _addToTrie(root, key, contact) {
        let node = root;
        for (let char of key) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
            node.contacts.push(contact);
        }
    }

    searchByName(name) {
        return this._searchTrie(this.rootName, name.toLowerCase());
    }

    searchByPhoneNumber(phoneNumber) {
        return this._searchTrie(this.rootPhoneNumber, phoneNumber);
    }

    _searchTrie(root, key) {
        let node = root;
        for (let char of key) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return node.contacts;
    }

    // Save data to disk
    saveToFile(filename) {
        const data = JSON.stringify({
            rootName: this.serializeTrie(this.rootName),
            rootPhoneNumber: this.serializeTrie(this.rootPhoneNumber),
        });
        fs.writeFileSync(filename, data);
    }

    // Load data from disk
    loadFromFile(filename) {
        try {
            const data = fs.readFileSync(filename, "utf8");
            const parsedData = JSON.parse(data);
            this.rootName = this.deserializeTrie(parsedData.rootName);
            this.rootPhoneNumber = this.deserializeTrie(
                parsedData.rootPhoneNumber
            );
        } catch (err) {
            console.error("Error loading data from file:", err.message);
        }
    }

    // Import data from CSV
    async importFromCSV(filename) {
        try {
            return new Promise((resolve, reject) => {
                const stream = fs
                    .createReadStream(filename)
                    .pipe(csv())
                    .on("data", (row) => {
                        const contact = new Contact(
                            row.FirstName,
                            row.LastName,
                            row.Address,
                            row.PhoneNumber
                        );
                        this.addContact(contact);
                    })
                    .on("end", () => {
                        console.log("CSV import complete.");
                        resolve();
                    })
                    .on("error", (error) => {
                        reject(error);
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    serializeTrie(node) {
        const serializedNode = { contacts: node.contacts, children: {} };

        for (const [char, childNode] of Object.entries(node.children)) {
            serializedNode.children[char] = this.serializeTrie(childNode);
        }

        return serializedNode;
    }

    deserializeTrie(serializedNode) {
        const node = new TrieNode();
        node.contacts = serializedNode.contacts;

        for (const [char, childNode] of Object.entries(
            serializedNode.children
        )) {
            node.children[char] = this.deserializeTrie(childNode);
        }

        return node;
    }
}

yargs
    .command({
        command: "import",
        describe: "Import contacts from a CSV file",
        builder: {
            file: {
                describe: "CSV file path",
                demandOption: true,
                type: "string",
            },
        },
        handler: async (argv) => {
            const addressBook = new AddressBook();
            try {
                await addressBook.importFromCSV(argv.file);
                addressBook.saveToFile("addressBookData.json");
            } catch (error) {
                console.error("Error importing data from CSV:", error.message);
            }
        },
    })
    .command({
        command: "search",
        describe: "Search for a contact",
        builder: {
            name: {
                describe: "Search by name",
                type: "string",
            },
            phone: {
                describe: "Search by phone number",
                type: "string",
            },
        },
        handler: (argv) => {
            const addressBook = new AddressBook();
            addressBook.loadFromFile("addressBookData.json");

            if (argv.name) {
                const searchResultByName = addressBook.searchByName(argv.name);
                console.log("Search Result by Name:", searchResultByName);
            }

            if (argv.phone) {
                const searchResultByPhoneNumber =
                    addressBook.searchByPhoneNumber(argv.phone);
                console.log(
                    "Search Result by Phone Number:",
                    searchResultByPhoneNumber
                );
            }
        },
    })
    .demandCommand()
    .help().argv;
