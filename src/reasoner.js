const Reasoner = require('reasoner');
const Graph = Reasoner.Graph;
const as = require('vocabs-as');
const owl = require('vocabs-owl');
const rdf = require('vocabs-rdf');
const rdfs = require('vocabs-rdfs');
const asx = require('vocabs-asx');
const ldp = require('vocabs-ldp');

const functionalObject = [owl.ObjectProperty, owl.FunctionalProperty],
  functionalDatatype = [owl.DatatypeProperty, owl.FunctionalProperty],
  languageProperty = [owl.DatatypeProperty, asx.LanguageProperty];

const graph = new Graph();

graph.add({
  subject: as.items,
  predicate: rdfs.subClassOf,
  object: asx.PossiblyOrdered
});
graph.add({
  subject: as.Accept,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Accept,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Activity,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Tombstone,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Block,
  predicate: rdfs.subClassOf,
  object: as.Ignore
});
graph.add({
  subject: as.IntransitiveActivity,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Add,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Announce,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Application,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Arrive,
  predicate: rdfs.subClassOf,
  object: as.IntransitiveActivity
});
graph.add({
  subject: as.Article,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Audio,
  predicate: rdfs.subClassOf,
  object: as.Document
});
graph.add({
  subject: as.Collection,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.CollectionPage,
  predicate: rdfs.subClassOf,
  object: as.Collection
});
graph.add({
  subject: as.OrderedCollectionPage,
  predicate: rdfs.subClassOf,
  object: as.CollectionPage
});
graph.add({
  subject: as.OrderedCollectionPage,
  predicate: rdfs.subClassOf,
  object: as.OrderedCollection
});
graph.add({
  subject: as.Relationship,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Create,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Delete,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Dislike,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Document,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Event,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Flag,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Follow,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Group,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Ignore,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Image,
  predicate: rdfs.subClassOf,
  object: as.Document
});
graph.add({
  subject: as.Invite,
  predicate: rdfs.subClassOf,
  object: as.Offer
});
graph.add({
  subject: as.Join,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Leave,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Like,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.View,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Listen,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Read,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Move,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Travel,
  predicate: rdfs.subClassOf,
  object: as.IntransitiveActivity
});
graph.add({
  subject: as.Update,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Mention,
  predicate: rdfs.subClassOf,
  object: as.Link
});
graph.add({
  subject: as.Note,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Offer,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.OrderedCollection,
  predicate: rdfs.subClassOf,
  object: as.Collection
});
graph.add({
  subject: as.Page,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Profile,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Person,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Organization,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Place,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.Question,
  predicate: rdfs.subClassOf,
  object: [as.Object, as.IntransitiveActivity]
});
graph.add({
  subject: as.Reject,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Remove,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Service,
  predicate: rdfs.subClassOf,
  object: as.Object
});
graph.add({
  subject: as.TentativeAccept,
  predicate: rdfs.subClassOf,
  object: as.Accept
});
graph.add({
  subject: as.TentativeReject,
  predicate: rdfs.subClassOf,
  object: as.Reject
});
graph.add({
  subject: as.Undo,
  predicate: rdfs.subClassOf,
  object: as.Activity
});
graph.add({
  subject: as.Video,
  predicate: rdfs.subClassOf,
  object: as.Document
});
//
graph.add({
  subject: as.describes,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.subject,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.relationship,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.first,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: rdf.rest,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.first,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.actor,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.attributedTo,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.attachment,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.partOf,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.bcc,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.bto,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.cc,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.context,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.current,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.first,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.generator,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.icon,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.instrument,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.image,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.inReplyTo,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.items,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.last,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.location,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.next,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.object,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.oneOf,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.anyOf,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.prev,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.preview,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.replies,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.formerType,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.result,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.audience,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.tag,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.target,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.origin,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.to,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.url,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.accuracy,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.altitude,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.content,
  predicate: rdf.type,
  object: languageProperty
});
graph.add({
  subject: as.name,
  predicate: rdf.type,
  object: languageProperty
});
graph.add({
  subject: as.duration,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.endTime,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.height,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.href,
  predicate: rdf.type,
  object: functionalObject
});
graph.add({
  subject: as.hreflang,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.latitude,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.longitude,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.mediaType,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.published,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.closed,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.deleted,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.radius,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.rel,
  predicate: rdf.type,
  object: owl.DatatypeProperty
});
graph.add({
  subject: as.startIndex,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.startTime,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.summary,
  predicate: rdf.type,
  object: languageProperty
});
graph.add({
  subject: as.totalItems,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.units,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.updated,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.width,
  predicate: rdf.type,
  object: functionalDatatype
});
graph.add({
  subject: as.actor,
  predicate: rdfs.subPropertyOf,
  object: as.attributedTo
});
graph.add({
  subject: as.author,
  predicate: rdfs.subPropertyOf,
  object: as.attributedTo
});
graph.add({
  subject: ldp.inbox,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.outbox,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.followers,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.following,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
graph.add({
  subject: as.liked,
  predicate: rdf.type,
  object: owl.ObjectProperty
});
module.exports = new Reasoner(graph);

module.exports.Graph = Reasoner.Graph;
