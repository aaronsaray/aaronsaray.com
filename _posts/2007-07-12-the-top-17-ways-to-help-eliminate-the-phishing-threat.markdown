---
layout: post
title: The top 17 ways to help eliminate the Phishing threat
tags:
- security
---
The following is the result of a research project I had done about phishing.  Its some best practices and suggestions based upon information from leading security professionals such as white hat security, McAfee, etc.  A combination of e-mail security, authentication methods and corporate identity standards are among the suggestions...  Here are the top solutions and methods of securing against Phishing:

**Establish Corporate Outgoing Email Policy**

One strategy suggested by McAfee that is coupled with user education is to establish an outgoing email policy.This means that every e-mail sent out from the employees as well as the web and other automated systems will have the same format to the entire e-mail.This includes a standard font and style, graphics, e-mail headers, etc.The users could be trained to spot e-mails that are not exactly in that same format.

**Verify E-mail Authenticity**

Each outgoing e-mail from an automated system could have a tracking number fully visible to the user.There is a verification page on the main website for the user to enter in the specific ID of the message.The verification page will provide a brief summary of the contents of the e-mail if its legitimate.If not, it will prompt the user to forward the entire email message to the abuse department.

**Remove Embedded URLs**

Another approach details removing embedded URLs in the e-mails that are sent.Coupled with education to never click a link in an e-mail, this can be an effective method; however, it severely limits usability for automated processes.Another solution was to send out only plain text e-mails, with the link URL in the content.This means there are no ways to fake the location of the URL.Unfortunately, some e-mail readers tend to parse URLs in plain-text and create them as hyperlinks.A clever phisher could generate an HTML based e-mail that mimics the plain text e-mails sent out - negating the effectiveness of this modified approach.

**No e-mail signup forms with sensitive information**

When users get familiar with a process to sign up for new services (such as broker or employer) with sensitive information on the webpage, they are more likely to enter this information into a phishing site.The rationale behind this trust comes from the user's assumption that they had to do it once before on the website - why should this time be any different.A modification of this approach could be to educate the users where their personal information will be gathered, and then to never submit it to the website ever again, regardless of any reason.

**Digitally Sign e-mails**

There are certification services to outgoing e-mail similar to the way SSL Certificates work on webservers.While implementing this solution will not be a widely usable solution, it may be effective for those business users using Microsoft products such as Outlook.This type of signing of e-mails will not grant much benefit to users using web based or unsupported e-mail clients.

**Passphrase or Identifiable information in an e-mail**

When the user signs up for their account, they must submit a passphrase for their account.This passphrase will be included in any e-mail communication with them.The user must be educated to reject an e-mail that does not match their passphrase.An extension of this approach is using personal information in the e-mail, such as a first and last name, a company name, an obfuscated identification number, etc.This way the user would reject any e-mail that did not begin with their proper salutation, etc.

**User Education - Security E-mail Updates**

There are many ways to educate users against phishing attacks.Sending a monthly or quarterly security email update is one method.This e-mail would include reminders to change their password or any other authentication information, give security tips on how to spot phishing sites, and remind them to upgrade their security software (antivirus, firewalls, etc)

**Protecting Company's Identity**

There are third party services such as Netcraft and NameProtect that offer services to watch company trademarks and property usage on the Internet.This proactive approach can help your company track down phishing sites before they take advantage of users.

Another process put in place by some companies is to create clever "whois" queries checking for websites nearing their own domain name.

**Phishing protection and Defense Planning / Protocols**

Some companies have found success in having a toll free telephone line or an e-mail box that is monitored for reports of phishing.Having this facility available can boost customer confidence in the company's dedication to security.It also assists the company in executing its defense protocol.

The defense protocol refers to a phishing response escalation path.Leading researchers in the field have suggested that companies should have a detailed response plan for responding to confirmed phishing attempts.These steps include verification of the content of the e-mail and intent, locating the offending sender and website host, contacting ISP's providing service to them and contacting the authorities.

**Phishing Honeypots**

A different approach noted by some vendors of security software include a home-grown approach of creating multiple spam and phishing honeypots.These e-mail address inbox's will have an automated script ran against their content to determine if any of them have any illegitimate company based phishing information.Any trapped will be forwarded to the defense protocol steps.

**Two Stage/Factor Authentication**

This process indicates a secondary authentication step to be followed after the user successfully logs in with their username and password.In a recent survey, 13% of users would switch their entire banking accounts from one institution to another - if the second one supported two step authentication.

Two step authentication can take on many forms.The two most notable are a personal identifier and a secondary security question.

The personal identifier method allows the user to upload a picture or generate a passphrase on account creation.After the user has authenticated, they are shown their passphrase or seal, and asked to confirm whether or not it is actually theirs.Users would need to be educated to not accept any website that does not show this token, immediately report the website, and then change their login credentials on the real website.

The other method requires the user to generate a security question.After the login, they are presented with this question - only a successful answer would allow them to continue.Once again, user education is primary here.

There are other methods that have proven less secure, such as this process: User enters their username and submits the form.They are presented with their identifier and are asked to enter their password.While this process is still more secure, it can easily be faked if the phisher wants to target specific user accounts.

**DPD - Delayed Password Disclosure**

DPD works according to the following principle: instead of entering his entire password, and then initiating the comparison, the comparison is done after each letter. However, neither side learns the actual outcome of the comparison - except the comparison performed after the last character. Instead, the result of each intermediary comparison is used to select an image to be displayed in the user's window. One such image is therefore displayed for each character of the password. If the user does not recognize a given image, then he will halt the password authentication session immediately. Even though the set of available images may not be specific to the user (but only the choice of these), we obtain probabilistic protection against an attacker, based on the low likelihood of being able to guess the correct image to send over to the user.

**Response Contact Procedure**

Some advanced security websites have been implementing a response contact procedure.This means that at every successful login to the website, the user is sent a txt message to their cellphone or an e-mail to their e-mail address on file.The user is educated to exit the website and change their credentials if the website does not send them that notification in a reasonable amount of time.

**Third Party Consumer Protection**

Security vendors such as Symantec provide services to businesses to integrate specific anti-phishing content into their email filtering software.This means that any end user using a Symantec product - such as Norton Anti-Virus - will automatically receive an update with the business's signature and traits of e-mails.If the user receives an e-mail that doesn't match the signature of the business, it will automatically be marked unsafe.

**Bypass Browser Based Password Services**

Some browsers automatically fill in information into form field.Certain browsers adhere to a specific attribute in a form box that disallow the information to be autofilled.Browsers also provide password saving functionality.A suggested solution to disable this includes having a third field that must be filled in - most browsers will only save the username and password - not the third security field.

**Responsibility in Logging Transactions and Referrers**

Financial institutions are leaning towards more logging capabilities.These include logging more details about the transaction, generating ID numbers for each transaction, storing full/incremental backups to undo specific transactions, etc.These extra steps allow the companies to roll back fraudulent changes easier.

Another process put into place is to restrict hot-linking of images.Although a phishing site may just download the entire website and display it on their webserver, others have been known to directly link to images on the targeted website.Disabling this ability could mitigate this.

Monitoring Referrers in access logs can help detect fraudulent domains for the company as well.When these are discovered, they can be investigated and possibly passed on to the phishing response team.

**Standard User Education**

At the very least, security firms are asking companies to train their internal employees to recognize phishing attempts - and possibly test them periodically at this.Once internal employees can recognize and understand these issues, they are more adept to teach customers.

The second part of this campaign is to create printed or online materials prominently displayed and distributed to users detailing the risks as well as the steps that the company is taking to protect the users.This needs to be delicately created, say most firms, to properly educate users of the risk while keeping secure their faith in the company's reliability
