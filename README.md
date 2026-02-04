# PUPFIND

## PUPFIND is a web-based application designed to track missing items at the Polytechnic University of the Philippines. The system facilitates the reporting of missing items and streamlines the process of matching them with found items, providing a platform to enhance the retrieval of lost valuables.

## Flow of Operation:

* User1 reports a missing item with a status of 'missing.'
* User2 and User3 report found items with a status of 'processing.'
* Found items must be surrendered to a designated office; failure to do so keeps the report status as 'processing.'
* Admin reviews all missing reports and relevant found reports for potential matches.
* Upon verification, the admin communicates with the owner of the missing report.
* Once the owner claims the item, both missing and found reports are updated to 'claimed.'

## User Functions:

* Register, log in, and log out of an account.
* Create missing and found item reports.
  * Missing item report: Item Name, Date, Possible location, Description, Item image (optional).
  * Found item report: Item Name, Date, Possible location, Description, Item image (required), and Surrender Office.
* Real-time chat function with admins.
* View a list of created reports.
* Edit account information.

## Admin Functions:

* Register, log in, and log out of an account.
* View top locations of lost items within the campus.
* Analyze the frequency of missing item reports per month.
* Create missing and found item reports for offline operations.
  * Missing item report: Item Name, Date, Possible location, Description, Item image (optional), and User's UID.
  * Found item report: Item Name, Date, Possible location, Description, Item image (optional), and User's UID.
* View tables of all missing and found reports designated to their office.
* Delete a report.
* Generate and download a receipt for a claimed report.
* Match similar missing and found reports.
* Generate CSV files for reports and users.
* Real-time chat function with users.
* Create a user account.

