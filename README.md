- TODO: ask yan if we can just add next step of awaiting:RESCHEDULED TOUR/CALL when rescheduled (If someone hits reschedule, we remove their next step from the "next step" view.)
- TODO: BUG: https://analytics.home0001.com/booking-details?email=luisaeastlaw@gmail.com

- TODO: cleanup booking-details page of querying booking details when it should not be relying on booking details but potentialCustomers (this would need to first be potentialCustomers have all the data i.e. every booking save to potentialCustomers as well before starting this)
- add query param if its next steps or bookings and keep it there when refreshing the page
- view bookings blue link should only be the width of itself not clickable for the whole width (same as view bookings)
- mobile view global search should be rounded-md and profile needs to be rounded-md as well to match other components
- when creating a booking, create/update potentialCustomers details
- add in buyingProgress user details to booking-details page
- clear all states of all dialogs for onClose handlers (bcuz sorting and filtering causes states to stay)
- close date popovers after selection (maybe onOpenChange prop in popover?)
- start getting fresh with buying progress and then start adding this info into booking-details page
- next steps as a tab with bookings LOW PRI
- filters need to be saved to db for user settings LOW PRI
- add in a show all users link to allow editing of existing users LOW PRI
- loading spinners for settings update buttons
- reword the next steps selection to be better
- export data from hubspot to db: https://app.hubspot.com/submissions/39987214/form/7832ce64-4c0d-46c8-acee-1f9396ee2a17/performance?redirectUrl=https%3A%2F%2Fapp.hubspot.com%2Fforms%2F39987214

- remove improper charts with data
- fix registration double registrations
- only submit to db if registers + add error handling of duplicate register (maybe new db for contact-us db)
- one user gets one count for the above stat if double register/bookings
- CALL RESCHEDULED whatsapp notification
- use preferred communication preference for notifications of 1h before phone calls
- conflicting bookings should not show when len of time is < 5
- phone number placeholder should give an example
- when delete customer, need to delete fireauth password as well
- add meeting notes to tours (same as phone call)
- cards for customers in mobile
- add hover color effect for dropdowns i.e. timeline for meeting notes button
- toast for deleting items everywhere in analytics
- add a message to reschedule if previous booking is <= 1h to say they will not be reminded of the booking
- no more filters to add / no more filers to remove in each place for both bookings and next steps
- add in - for meeting notes field in booking-details sub-labels
- hubspot properties for meeting notes needs to be set (check below, yan sent link for tours)
- add advanced settings for reschedule
- add in these values in each booking in each booking-details booking list (disableCalendarInvite?, disableTextNotification?)
- look into this: https://discord.com/channels/@me/935969951754375169/1270558785114734685
- restyle google doc inputs completely with section titles and such, use untitledui instagram post for inspiration
- make selects optional for google doc inputs

NO PRI:
- need indexes for firebase queries
- add pagination for bookings and next steps chart
- fix issue of image not rendering properly for next steps table same as bookings but a smaller number of cases, console log the bookings cases and see the issue thru the whole flow
- suggested times sometimes goes to a new line
- link validation for socials for update-profile.tsx inputs
- add labels (bigger) to sections of Profile Data inputs
- fix border-red-500 in bookings.tsx not doing the full width
- add social icons to booking-details page and the social inputs of profile data as an icon (maybe placeholder?)
- add a notification number beside bookings if there are pending bookings

HI PRI:
- if an existing data entry exists, it should be in read mode, not write mode but in booking-details page, everything is read mode until edit trigger is clicked
- fix up the whole design, add sections, nice looks, easy on the eyes, etc. - might not need sections to be cleaner and minimal
- advanced options for reschedule booking
- add a clear button for max budget if they have a value but want to undo (unknown) or a checkbox to set to unknown? also other fields that don't have a clear button that the user can't clear i.e. inputs can be cleared, selects can't

LOW PRI:
- filter by host
- add advanced options for reschedule (including regular values + add in a "host" option, see other things that can be added maybe (fill in potentialCustomers details with what it can i.e. name, email, phone, etc. if it doesn't exist))
- booking details first and last name should show skeleton when initially loading instead of saying undefined
- fix issue of adding next steps in next steps table row of adding ring to notes input
- when creating a new next step, add advanced options to mark previous next step as completed
- mobile cards for bookings needs icon for phone vs tours and should not show meeting link but a link to the location or something
- i need meeting notes and next steps for property tours as well in mobile view

AK - P2 (data cleanup):
- change all bed room preferences from strings to array
- the above bullet point but for any field
- add in all users who have not received an email for template B
- add in latest registers to db and save the last number completed
- i only want singleSendId in emailsSentHistory db, not templateId if it exists
- text: "" should be text: null
- clickedUrls needs to be {url: null, timestamp: null} if it doesn't exist or empty string
- opened needs to be {timestamp: null} if it doesn't exist or empty string
-
flashdynasty@gmail.com
darien.labeach@gmail.com
kvdoherty@gmail.com
joegefers@gmail.com
jligotti@gmail.com
hersy.reyn@exprealty.com
ancagmarinescu@gmail.com
vbondnyc@gmail.com
darcynathanson@gmail.com
deyvonrsanders@gmail.com
danzahirjunk@gmail.com
justindurazzo@gmail.com
ranise@gmail.com
e_b141@outlook.com
cassieraebledsoeartistry@yahoo.com
hasdinkabir11@gmail.com
jessicaannewei@gmail.com
nikhil.saukhla@gmail.com
przemyslaw@przemyslaw.org
duncan_jui@hotmail.com
joeychoe101@gmail.com
umyahc@yahoo.com
govcampdavid@yahoo.com
lapiapaez@gmail.com
kurtml.pinlac@gmail.com
grisha.sorokin@gmail.com
nguyen.t.bella@gmail.com
timlithinks@gmail.com
michellekellywu@gmail.com
smaesta@gmail.com

might have duplicate entries in emailsSentHistory db

AY - P1:
- email stats dashboard
- add in all users who were sent template A and B to the emailsSentHistory db
- hubspot needs a webhook so it saves to our db about info about hubspot emails
- look into unsubscribes not working
- fix registers not being saved to db
