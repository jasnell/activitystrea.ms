'use strict';

const assert = require('assert');
const as = require('..');
const models = require('../src/models');
const asv = require('vocabs-as');
const social = require('vocabs-social');
const interval = require('vocabs-interval');

const now = new Date();
const nowiso = now.toISOString();

describe('Basics...', ()=> {
  it('should build a minimal object', (done)=> {
    var object = as.object().get();
    assert.equal(object.type, asv.Object);
    done();
  });
  
  function testFunctionalProperties(object) {
    assert.equal(object.content.get(), 'bar');
    assert.equal(object.content.get('fr'), 'foo');
    assert.equal(object.name.get('de'), 'baz');
    assert.equal(object.summary.get('es'), 'bar');
    assert.equal(object.endTime.toISOString(), nowiso);
    assert.equal(object.startTime.toISOString(), nowiso);
    assert.equal(object.published.toISOString(), nowiso);
    assert.equal(object.updated.toISOString(), nowiso);
  }
  
  it('should create an object and return all the correct values', (done)=> {
    var object = as.object()
      .content(
        as.langmap()
          .set('en', 'bar')
          .set('fr', 'foo'))
      .name(
        as.langmap()
          .set('de', 'baz'))
      .summary(
        as.langmap()
          .set('es', 'bar'))
      .endTime(now)
      .startTime(now)
      .published(now)
      .updated(now)
      .get();
    testFunctionalProperties(object);
    done();
  });
  
  it('should roundtrip correctly', (done)=> {
    var object = as.object()
      .content(
        as.langmap()
          .set('en', 'bar')
          .set('fr', 'foo'))
      .name(
        as.langmap()
          .set('de', 'baz'))
      .summary(
        as.langmap()
          .set('es', 'bar'))
      .endTime(now)
      .startTime(now)
      .published(now)
      .updated(now)
      .get();
    object.export((e,d)=> {
      assert.equal(e, null);
      as.import(d, (e,d)=> {
        assert.equal(e,undefined);
        testFunctionalProperties(d);
        done();
      });
    });
  });
  
  it('should create a basic activity object', (done)=> {
    let activity = as.activity().actor('http://example').get();
    assert(activity instanceof models.Object);
    assert(activity.actor);
    assert(activity.actor.first);
    assert(activity.actor.first.id, 'http://example');
    done();
  });
  
  it('should create a basic collection object', (done)=> {
    let collection = as.collection().totalItems(1).get();
    assert(collection instanceof models.Object);
    assert(collection.totalItems, 1);
    done();
  });
  
  it('should create a basic ordered collection object', (done)=> {
    let collection = as.orderedCollection().totalItems(1).get();
    assert(collection instanceof models.Object);
    assert(collection.totalItems, 1);
    done();
  });
  
  it('should create a basic link object', (done)=> {
    assert(as.link().get() instanceof models.Link);
    done();
  });
  
  it('should create activities with an appropriate type', (done)=> {
    [['accept',asv.Accept],
     ['tentativeAccept',asv.TentativeAccept],
     ['add',asv.Add],
     ['arrive',asv.Arrive],
     ['create',asv.Create],
     ['delete',asv.Delete],
     ['follow',asv.Follow],
     ['ignore',asv.Ignore],
     ['join',asv.Join],
     ['leave',asv.Leave],
     ['like',asv.Like],
     ['offer',asv.Offer],
     ['invite',asv.Invite],
     ['reject',asv.Reject],
     ['tentativeReject',asv.TentativeReject],
     ['remove',asv.Remove],
     ['undo',asv.Undo],
     ['update',asv.Update],
     ['view',asv.View],
     ['listen',asv.Listen],
     ['read',asv.Read],
     ['move',asv.Move],
     ['travel',asv.Travel],
     ['announce',asv.Announce],
     ['block',asv.Block],
     ['flag',asv.Flag],
     ['dislike',asv.Dislike]
   ].forEach((key)=> {
      var obj = as[key[0]]().get();
      assert(obj instanceof models.Object);
      assert.equal(obj.type,key[1]);
    });
    done();
  });
  
  it('should create objects with an appropriate type', (done)=> {
    [
     ['application',asv.Application],
     ['group',asv.Group],
     ['person',asv.Person],
     ['organization',asv.Organization],
     ['service',asv.Service],
     ['article',asv.Article],
     ['document',asv.Document],
     ['relationship',asv.Relationship],
     ['profile',asv.Profile],
     ['audio',asv.Audio],
     ['image',asv.Image],
     ['video',asv.Video],
     ['note',asv.Note],
     ['page',asv.Page],
     ['question',asv.Question],
     ['event',asv.Event],
     ['place',asv.Place]
   ].forEach((key)=> {
      var obj = as[key[0]]().get();
      assert(obj instanceof models.Object);
      assert.equal(obj.type,key[1]);
    });
    done();
  });
  
  it('should create link objects with an appropriate type', (done)=> {
    [['mention',asv.Mention]].forEach((key)=> {
      var obj = as[key[0]]().get();
      assert(obj instanceof models.Link);
      assert.equal(obj.type,key[1]);
    });
    done();
  });
  
  it('should create a complex object', (done)=> {
    // Test complex creation
    var obj =
      as.create()
        .actor('acct:joe@example.org')
        .object(as.note().content('this is a note'))
        .get();
  
    assert.equal(1, obj.actor.length);
    var actor = obj.actor.first;
    assert.equal('acct:joe@example.org', actor.id);
    assert(actor instanceof models.Object);
  
    assert.equal(1, obj.object.length);
    var note = obj.object.first;
    assert.equal(asv.Note, note.type);
    assert.equal(note.content.get(), 'this is a note');
    done();
  });
  
  it('should import from JSON without errors', (done)=> {
    as.import({
      'type': 'Like',
      nameMap: {
        en: 'foo'
      },
      actor: {
        'type': 'Person',
        name: 'Joe'
      },
      object: {
        'type': 'http://example.org/Table',
        name: 'Table'
      }
    }, (err, doc)=> {
      assert.equal(null, err);
      assert.equal(asv.Like, doc.type);
      assert.equal(doc.name, 'foo');
      let actor = doc.actor.first;
      assert.equal(asv.Person, actor.type);
      assert.equal(actor.name, 'Joe');
      done();
    });
  });

  it('should handle languages properly', (done)=> {
    var LanguageValue = require('../src/models/_languagevalue');
    var B = new LanguageValue.Builder();
    B.set('en-US', 'bar');
    B.set('fr-US', 'baz');
    B.set('fr', 'boo');
    var lv = B.get();
    assert.equal(lv.get(), 'bar');
    assert.equal(lv.get('en'), 'bar');
    assert.equal(lv.get('en-us'), 'bar');
    assert.equal(lv.get('en-US'), 'bar');
    assert.equal(lv.get('en-Us-Scrp'), 'bar');
    assert.equal(lv.get('fr'), 'boo');
    assert.equal(lv.get('FR-US'), 'baz');
    done();
  });

  it('should roundtrip the RDF properly', (done)=> {
    var obj = as.object().name('test').get();
    obj.toRDF((err,doc)=> {
      assert.equal(err, undefined);
      assert(doc);
      as.importFromRDF(doc, (err,doc)=> {
        assert.equal(err, undefined);
        assert.equal(doc.name.get(), 'test');
        done();
      });
    });
  });

  it('should import an object with just an id', (done)=> {
    var test = {'id': 'http://example.org'};
    as.import(test, (err,doc)=> {
      assert.equal(err,undefined);
      assert.equal(doc.id, 'http://example.org');
      done();
    });
  });

  it('should have appropriate values for every orderedcollection property',
    (done)=> {

    var doc = as.orderedCollection()
      .id('http://example.org')
      .totalItems(1)
      .current('http://example.org/current')
      .first('http://example.org/first')
      .last('http://example.org/last')
      .items('http://example.org/item/1')
      .items('http://example.org/item/2')
      .get();
    assert(doc instanceof as.models.Object);
    assert.equal(doc.totalItems, 1);
    assert.equal(doc.current.id, 'http://example.org/current');
    assert.equal(doc.first.id, 'http://example.org/first');
    assert.equal(doc.last.id, 'http://example.org/last');
    assert.equal(doc.items.length, 2);
    const iter = doc.items[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'http://example.org/item/1');
    assert.equal(iter.next().value.id, 'http://example.org/item/2');
    done();
  });

  it('should have appropriate values for every orderedcollection property',
    (done)=> {

    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'id': 'http://example.org',
      'type': 'OrderedCollection',
      totalItems: 1,
      current: 'http://example.org/current',
      first: 'http://example.org/first',
      last: 'http://example.org/last',
      items: [
        'http://example.org/item/1',
        'http://example.org/item/2'
      ]
    };

    as.import(test, (err, doc)=> {
      assert.equal(err, undefined);
      assert(doc instanceof as.models.Object);
      assert.equal(doc.totalItems, 1);
      assert.equal(doc.current.id, 'http://example.org/current');
      assert.equal(doc.first.id, 'http://example.org/first');
      assert.equal(doc.last.id, 'http://example.org/last');
      assert.equal(doc.items.length, 2);
      const iter = doc.items[Symbol.iterator]();
      assert.equal(iter.next().value.id, 'http://example.org/item/1');
      assert.equal(iter.next().value.id, 'http://example.org/item/2');

      done();
    });

  });

  it('should have appropriate values for every collection property',
    (done)=> {

    var doc = as.collection()
      .id('http://example.org')
      .totalItems(1)
      .current('http://example.org/current')
      .first('http://example.org/first')
      .last('http://example.org/last')
      .items('http://example.org/item/1')
      .items('http://example.org/item/2')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.totalItems, 1);
    assert.equal(doc.current.id, 'http://example.org/current');
    assert.equal(doc.first.id, 'http://example.org/first');
    assert.equal(doc.last.id, 'http://example.org/last');
    assert.equal(doc.items.length, 2);
    const iter = doc.items[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'http://example.org/item/1');
    assert.equal(iter.next().value.id, 'http://example.org/item/2');

    done();
  });

  it('should have appropriate values for every collection property',
    (done)=> {

    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'id': 'http://example.org',
      'type': 'Collection',
      totalItems: 1,
      current: 'http://example.org/current',
      first: 'http://example.org/first',
      last: 'http://example.org/last',
      items: [
        'http://example.org/item/1',
        'http://example.org/item/2'
      ]
    };

    as.import(test, (err, doc)=> {
      assert.equal(err, undefined);
      assert(doc instanceof as.models.Object);
      assert.equal(doc.totalItems, 1);
      assert.equal(doc.current.id, 'http://example.org/current');
      assert.equal(doc.first.id, 'http://example.org/first');
      assert.equal(doc.last.id, 'http://example.org/last');
      assert.equal(doc.items.length, 2);
      const iter = doc.items[Symbol.iterator]();
      assert.equal(iter.next().value.id, 'http://example.org/item/1');
      assert.equal(iter.next().value.id, 'http://example.org/item/2');
      done();
    });

  });

  it('should have appropriate values for every activity property',
    (done)=> {

    var doc = as.activity()
      .id('http://example.org')
      .actor('http://example.org/actor')
      .object('http://example.org/object')
      .target('http://example.org/target')
      .result('http://example.org/result')
      .origin('http://example.org/origin')
      .instrument('http://example.org/instrument')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.id, 'http://example.org');

    assert(doc.actor);
    assert.equal(doc.actor.length,1);
    assert.equal(doc.actor.first.id, 'http://example.org/actor');
    assert(doc.object);
    assert.equal(doc.object.length,1);
    assert.equal(doc.object.first.id, 'http://example.org/object');
    assert(doc.target);
    assert.equal(doc.target.length,1);
    assert.equal(doc.target.first.id, 'http://example.org/target');
    assert(doc.result);
    assert.equal(doc.result.length,1);
    assert.equal(doc.result.first.id, 'http://example.org/result');
    assert(doc.origin);
    assert.equal(doc.origin.length,1);
    assert.equal(doc.origin.first.id, 'http://example.org/origin');
    assert(doc.instrument);
    assert.equal(doc.instrument.length,1);
    assert.equal(doc.instrument.first.id, 'http://example.org/instrument');

    done();
  });

  it('should have appropriate values for every activity property',
    (done)=> {

    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'id': 'http://example.org',
      'type': 'Activity',
      actor: 'http://example.org/actor',
      object: 'http://example.org/object',
      target: 'http://example.org/target',
      result: 'http://example.org/result',
      origin: 'http://example.org/origin',
      instrument: 'http://example.org/instrument'
    };

    as.import(test, (err,doc)=> {
      assert.equal(err, undefined);
      assert(doc instanceof as.models.Object);
      assert.equal(doc.id, 'http://example.org');

      assert(doc.actor);
      assert.equal(doc.actor.length,1);
      assert.equal(doc.actor.first.id, 'http://example.org/actor');
      assert(doc.object);
      assert.equal(doc.object.length,1);
      assert.equal(doc.object.first.id, 'http://example.org/object');
      assert(doc.target);
      assert.equal(doc.target.length,1);
      assert.equal(doc.target.first.id, 'http://example.org/target');
      assert(doc.result);
      assert.equal(doc.result.length,1);
      assert.equal(doc.result.first.id, 'http://example.org/result');
      assert(doc.origin);
      assert.equal(doc.origin.length,1);
      assert.equal(doc.origin.first.id, 'http://example.org/origin');
      assert(doc.instrument);
      assert.equal(doc.instrument.length,1);
      assert.equal(doc.instrument.first.id, 'http://example.org/instrument');
      done();
    });

  });

  it('should have appropriate values for every link property',
    (done)=> {
    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'id': 'http://example.org',
      'type': 'Link',
      href: 'http://example.org',
      rel: ['a','b'],
      mediaType: 'application/text',
      name: 'the display name',
      hreflang: 'en',
      height: 10,
      width: 10,
    };
    as.import(test, (err, doc)=> {
      assert.equal(err, undefined);
      assert(doc instanceof as.models.Link);
      assert.equal(doc.id, 'http://example.org');
      assert.equal(doc.href, 'http://example.org');
      const iter = doc.rel[Symbol.iterator]();
      assert.equal(iter.next().value, 'a');
      assert.equal(iter.next().value, 'b');
      assert.equal(doc.mediaType, 'application/text');
      assert.equal(doc.name.get(), 'the display name');
      assert.equal(doc.hreflang, 'en');
      assert.equal(doc.height, 10);
      assert.equal(doc.width, 10);
      done();
    });
  });

  it('should have appropriate values for every link property',
    (done)=> {
    var doc = as.link()
      .id('http://example.org')
      .href('http://example.org')
      .rel('a')
      .rel('b')
      .mediaType('application/text')
      .name('the display name')
      .hreflang('en')
      .height(10)
      .width(10)
      .get();

    assert(doc instanceof as.models.Link);
    assert.equal(doc.id, 'http://example.org');
    assert.equal(doc.href, 'http://example.org');
    const iter = doc.rel[Symbol.iterator]();
    assert.equal(iter.next().value, 'a');
    assert.equal(iter.next().value, 'b');
    assert.equal(doc.mediaType, 'application/text');
    assert.equal(doc.name.get(), 'the display name');
    assert.equal(doc.hreflang, 'en');
    assert.equal(doc.height, 10);
    assert.equal(doc.width, 10);
    done();

  });

  it('should have appropriate values for every object property',
     (done)=> {
    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'id': 'http://example.org',
      'type': 'Object',
      attachment: 'http://example.org/attachment',
      attributedTo: 'http://sally.example.org',
      content: 'the content',
      context: 'http://example.org/context',
      name: 'the display name',
      endTime: '2015-12-12T12:12:12Z',
      generator: 'http://example.org/generator',
      icon: 'http://example.org/icon',
      image: 'http://example.org/image',
      inReplyTo: 'http://example.org/in-reply-to',
      location: 'http://example.org/location',
      preview: 'http://example.org/preview',
      tag: 'http://example.org/tag',
      updated: '2015-12-12T12:12:12Z',
      published: '2015-12-12T12:12:12Z',
      replies: 'http://example.org/replies',
      scope: 'http://example.org/scope',
      startTime: '2015-12-12T12:12:12Z',
      url: 'http://example.org',
      to: 'http://joe.example.org',
      bto: 'http://sally.example.org',
      cc: 'http://mark.example.org',
      bcc: 'http://jane.example.org'
    };
    as.import(test, (err, doc)=> {
      assert.equal(err, undefined);
      assert.equal(doc.id, 'http://example.org');
      assert.equal(doc.type, asv.Object);
      assert(doc.attachment);
      assert.equal(doc.attachment.length,1);
      assert.equal(doc.attachment.first.id, 'http://example.org/attachment');
      assert(doc.attributedTo);
      assert.equal(doc.attributedTo.length,1);
      assert.equal(doc.attributedTo.first.id, 'http://sally.example.org');
      assert.equal(doc.content.get(), 'the content');
      assert(doc.context);
      assert.equal(doc.context.length,1);
      assert.equal(doc.context.first.id, 'http://example.org/context');
      assert.equal(doc.name.get(), 'the display name');
      assert.equal(doc.endTime.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.generator);
      assert.equal(doc.generator.length,1);
      assert.equal(doc.generator.first.id, 'http://example.org/generator');
      assert(doc.icon);
      assert.equal(doc.icon.length,1);
      assert.equal(doc.icon.first.id, 'http://example.org/icon');
      assert(doc.image);
      assert.equal(doc.image.length,1);
      assert.equal(doc.image.first.id, 'http://example.org/image');
      assert(doc.inReplyTo);
      assert.equal(doc.inReplyTo.length,1);
      assert.equal(doc.inReplyTo.first.id, 'http://example.org/in-reply-to');
      assert(doc.location);
      assert.equal(doc.location.length,1);
      assert.equal(doc.location.first.id, 'http://example.org/location');
      assert(doc.preview);
      assert.equal(doc.preview.length,1);
      assert.equal(doc.preview.first.id, 'http://example.org/preview');
      assert(doc.tag);
      assert.equal(doc.tag.length,1);
      assert.equal(doc.tag.first.id, 'http://example.org/tag');
      assert.equal(doc.updated.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert.equal(doc.published.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.replies);
      assert.equal(doc.replies.length,1);
      assert.equal(doc.replies.first.id, 'http://example.org/replies');
      assert(doc.scope);
      assert.equal(doc.scope.length,1);
      assert.equal(doc.scope.first.id, 'http://example.org/scope');
      assert(doc.url);
      assert.equal(doc.url.length,1);
      assert.equal(doc.url.first.id, 'http://example.org');
      assert.equal(doc.startTime.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.to);
      assert.equal(doc.to.length,1);
      assert.equal(doc.to.first.id, 'http://joe.example.org');
      assert(doc.bto);
      assert.equal(doc.bto.length,1);
      assert.equal(doc.bto.first.id, 'http://sally.example.org');
      assert(doc.cc);
      assert.equal(doc.cc.length,1);
      assert.equal(doc.cc.first.id, 'http://mark.example.org');
      assert(doc.bcc);
      assert.equal(doc.bcc.length,1);
      assert.equal(doc.bcc.first.id, 'http://jane.example.org');
      done();
    });
  });

  it('should have appropriate values for every object property',
     (done)=> {
    var doc = as.object()
      .id('http://example.org')
      .attachment('http://example.org/attachment')
      .attributedTo('http://sally.example.org')
      .content('the content')
      .context('http://example.org/context')
      .name('the display name')
      .endTime(new Date('2015-12-12T12:12:12Z'))
      .generator('http://example.org/generator')
      .icon('http://example.org/icon')
      .image('http://example.org/image')
      .inReplyTo('http://example.org/in-reply-to')
      .location('http://example.org/location')
      .preview('http://example.org/preview')
      .tag('http://example.org/tag')
      .updated(new Date('2015-12-12T12:12:12Z'))
      .published(new Date('2015-12-12T12:12:12Z'))
      .replies('http://example.org/replies')
      .scope('http://example.org/scope')
      .startTime(new Date('2015-12-12T12:12:12Z'))
      .url('http://example.org')
      .to('http://joe.example.org')
      .bto('http://sally.example.org')
      .cc('http://mark.example.org')
      .bcc('http://jane.example.org')
      .get();
      assert.equal(doc.id, 'http://example.org');
      assert.equal(doc.type, asv.Object);
      assert(doc.attachment);
      assert.equal(doc.attachment.length,1);
      assert.equal(doc.attachment.first.id, 'http://example.org/attachment');
      assert(doc.attributedTo);
      assert.equal(doc.attributedTo.length,1);
      assert.equal(doc.attributedTo.first.id, 'http://sally.example.org');
      assert.equal(doc.content.get(), 'the content');
      assert(doc.context);
      assert.equal(doc.context.length,1);
      assert.equal(doc.context.first.id, 'http://example.org/context');
      assert.equal(doc.name.get(), 'the display name');
      assert.equal(doc.endTime.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.generator);
      assert.equal(doc.generator.length,1);
      assert.equal(doc.generator.first.id, 'http://example.org/generator');
      assert(doc.icon);
      assert.equal(doc.icon.length,1);
      assert.equal(doc.icon.first.id, 'http://example.org/icon');
      assert(doc.image);
      assert.equal(doc.image.length,1);
      assert.equal(doc.image.first.id, 'http://example.org/image');
      assert(doc.inReplyTo);
      assert.equal(doc.inReplyTo.length,1);
      assert.equal(doc.inReplyTo.first.id, 'http://example.org/in-reply-to');
      assert(doc.location);
      assert.equal(doc.location.length,1);
      assert.equal(doc.location.first.id, 'http://example.org/location');
      assert(doc.preview);
      assert.equal(doc.preview.length,1);
      assert.equal(doc.preview.first.id, 'http://example.org/preview');
      assert(doc.tag);
      assert.equal(doc.tag.length,1);
      assert.equal(doc.tag.first.id, 'http://example.org/tag');
      assert.equal(doc.updated.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert.equal(doc.published.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.replies);
      assert.equal(doc.replies.length,1);
      assert.equal(doc.replies.first.id, 'http://example.org/replies');
      assert(doc.scope);
      assert.equal(doc.scope.length,1);
      assert.equal(doc.scope.first.id, 'http://example.org/scope');
      assert(doc.url);
      assert.equal(doc.url.length,1);
      assert.equal(doc.url.first.id, 'http://example.org');
      assert.equal(doc.startTime.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.to);
      assert.equal(doc.to.length,1);
      assert.equal(doc.to.first.id, 'http://joe.example.org');
      assert(doc.bto);
      assert.equal(doc.bto.length,1);
      assert.equal(doc.bto.first.id, 'http://sally.example.org');
      assert(doc.cc);
      assert.equal(doc.cc.length,1);
      assert.equal(doc.cc.first.id, 'http://mark.example.org');
      assert(doc.bcc);
      assert.equal(doc.bcc.length,1);
      assert.equal(doc.bcc.first.id, 'http://jane.example.org');
      done();

  });

  it('should have appropriate values for the relationship object',
    (done)=> {

      var test = {
        '@context': 'http://www.w3.org/ns/activitystreams#',
        'type': 'Relationship',
        subject: 'http://sally.example.org',
        relationship: 'http://example.org',
        object: 'http://joe.example.org'
      };

      as.import(test, (err,doc)=> {
        assert.equal(err, undefined);
        assert(doc instanceof as.models.Object);
        assert(doc.subject.id, 'http://sally.example.org');
        assert(doc.relationship);
        assert.equal(doc.relationship.length, 1);
        assert.equal(doc.relationship.first.id, 'http://example.org');
        assert(doc.object);
        assert.equal(doc.object.length, 1);
        assert.equal(doc.object.first.id, 'http://joe.example.org');
        done();
      });

  });

  it('should have appropriate values for the relationship object',
    (done)=> {

      var doc = as.relationship()
        .subject('http://sally.example.org')
        .relationship('http://example.org')
        .object('http://joe.example.org')
        .get();

      assert(doc instanceof as.models.Object);
      assert(doc.subject.id, 'http://sally.example.org');
      assert(doc.relationship);
      assert.equal(doc.relationship.length, 1);
      assert.equal(doc.relationship.first.id, 'http://example.org');
      assert(doc.object);
      assert.equal(doc.object.length, 1);
      assert.equal(doc.object.first.id, 'http://joe.example.org');
      done();

  });

  it('should have appropriate values for the question object',
    (done)=> {

    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'type': 'Question',
      name: 'the question',
      anyOf: [{'id':'urn:answer1'},{'id':'urn:answer2'}]
    };

    as.import(test, (err, doc)=> {
      assert.equal(err, undefined);
      assert(doc instanceof as.models.Object);
      assert.equal(doc.name.get(), 'the question');
      assert(doc.anyOf);
      assert.equal(doc.anyOf.length,2);
      const iter = doc.anyOf[Symbol.iterator]();
      assert.equal(iter.next().value.id, 'urn:answer1');
      assert.equal(iter.next().value.id, 'urn:answer2');
      done();
    });
  });

  it('should have appropriate values for the question object',
    (done)=> {

    var doc = as.question()
      .name('the question')
      .anyOf('urn:answer1')
      .anyOf('urn:answer2')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.name.get(), 'the question');
    assert(doc.anyOf);
    assert.equal(doc.anyOf.length,2);
    const iter = doc.anyOf[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'urn:answer1');
    assert.equal(iter.next().value.id, 'urn:answer2');
    done();

  });

  it('should have appropriate values for the place object', (done)=> {

    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'type': 'Place',
      accuracy: 10,
      altitude: 10,
      latitude: 10,
      longitude: 10,
      radius: 10,
      units: 'm'
    };

    as.import(test, (err, doc)=> {
      assert.equal(err, undefined);
      assert(doc instanceof as.models.Object);
      assert.equal(doc.accuracy, 10);
      assert.equal(doc.altitude, 10);
      assert.equal(doc.latitude, 10);
      assert.equal(doc.longitude, 10);
      assert.equal(doc.radius, 10);
      assert.equal(doc.units, 'm');
      done();
    });

  });

  it('should have appropriate values for the place object', (done)=> {

    var doc = as.place()
      .accuracy(10)
      .altitude(10)
      .latitude(10)
      .longitude(10)
      .radius(10)
      .units('m')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.accuracy, 10);
    assert.equal(doc.altitude, 10);
    assert.equal(doc.latitude, 10);
    assert.equal(doc.longitude, 10);
    assert.equal(doc.radius, 10);
    assert.equal(doc.units, 'm');
    done();

  });

  it('should have appropriate values for the profile object', (done)=> {

    var test = {
      '@context': 'http://www.w3.org/ns/activitystreams#',
      'type': 'Profile',
      describes: 'http://example.org'
    };

    as.import(test, (err, doc)=> {
      assert.equal(err, undefined);
      assert(doc instanceof as.models.Object);
      assert.equal(doc.describes.id, 'http://example.org');
      done();
    });

  });

  it('should have appropriate values for the profile object', (done)=> {

    var doc = as.profile()
      .describes('http://example.org')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.describes.id, 'http://example.org');
    done();

  });

  it('should use the default context', (done)=> {
    var test = {'id':'urn:test', name: 'test'};
    as.import(test, (err,doc)=> {
      assert.equal(err, undefined);
      assert.equal(doc.id, 'urn:test');
      assert.equal(doc.name.get(), 'test');
      done();
    });
  });
  
  it('Nothing in as vocab should be undefined', (done)=> {
    let keys = Object.keys(asv).filter((item)=>{return !(asv[item]);});
    assert.equal(0, keys.length);
    done();
  });
});

describe('Streaming...', ()=> {

  it('Should read and parse from the stream', (done)=> {
    var fs = require('fs');
    var AS2Stream = as.Stream;
    var path = require('path');
    var through = require('through2');

    fs.createReadStream(path.resolve(__dirname,'test.json'))
      .pipe(new AS2Stream())
      .pipe(through.obj((chunk,encoding,callback)=> {
        assert(chunk);
        assert(chunk.type);
        assert.equal(chunk.type, asv.Person);
        assert.equal(chunk.name.get(), 'Sally');
        done();
      }));
  });

  it('Should write to the stream', (done)=> {
    var AS2Stream = as.Stream;
    var through = require('through2');
    var obj = as.object().name('test').get();
    obj.stream({objectMode:true})
      .pipe(new AS2Stream())
      .pipe(through.obj((chunk,encoding,callback)=> {
        assert(chunk);
        assert(chunk.type);
        assert.equal(chunk.name.valueOf(), 'testing');
      }));
    done();
  });
});

describe('Templates...', ()=> {
  it('Should use one object as a template for another', (done)=> {
    var tmpl = as.like().actor(as.person().name('Joe')).template();
    var like = tmpl().object('http://example.org/foo').get();
    assert(like.actor);
    assert.equal(like.actor.first.name.get(), 'Joe');
    assert(like.object);
    assert.equal(like.object.first.id, 'http://example.org/foo');
    assert(!tmpl.object);
    done();
  });

  it('should allow a value to be removed or replaced', (done)=> {
    var tmpl = as.like().actor(as.person().name('Joe')).template();
    var like = tmpl().actor().get();
    assert(!like.actor);
    done();
  });
});

describe('Extensions...', ()=> {
  it('should initialize the Interval and Social Extensions', (done)=> {
    as.use(as.interval);
    as.use(as.social);
    assert.equal(require('../src/extcontext.js').get().length, 2);
    done();
  });

  it('should create interval objects with appropriate type and values',
  (done)=> {
    [
      ['open', interval.OpenInterval],
      ['closed', interval.ClosedInterval],
      ['openClosed', interval.OpenClosedInterval],
      ['closedOpen', interval.ClosedOpenInterval],
      ['leftOpen', interval.LeftOpenInterval],
      ['rightOpen', interval.RightOpenInterval],
      ['leftClosed', interval.LeftClosedInterval],
      ['rightClosed', interval.RightClosedInterval],
    ].forEach((key)=>{
      var obj = as.interval[key[0]]().
        upper(1).
        lower(0).
        step(1).
        get();
      assert(obj instanceof as.models.Object);
      assert.equal(obj.type,key[1]);
      assert.equal(obj.upper, 1);
      assert.equal(obj.lower, 0);
      assert.equal(obj.step, 1);
    });
    done();
  });

  it('should create population objects with appropriate type', (done)=> {
    [
      ['population', social.Population],
      ['everyone', social.Everyone],
      ['public', social.Public],
      ['private', social.Private],
      ['direct', social.Direct],
      ['common', social.Common],
      ['interested', social.Interested],
      ['self', social.Self],
      ['all', social.All],
      ['any', social.Any],
      ['none', social.None],
      ['compoundPopulation', social.CompoundPopulation]
    ].forEach((key)=> {
      var obj = as.social[key[0]]().get();
      assert(obj instanceof as.models.Object);
      assert.equal(obj.type, key[1]);
    });
    done();
  });

  it('should create a signed entry and verify it', (done)=> {

    var testPublicKeyUrl = 'https://example.com/i/alice/keys/1';
    var testPublicKeyPem =
      '-----BEGIN PUBLIC KEY-----\r\n' +
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4R1AmYYyE47FMZgo708NhFU+t\r\n' +
      '+VWn133PYGt/WYmD5BnKj679YiUmyrC3hX6oZfo4eVpOkycxZvGgXCLQGuDp45Xf\r\n' +
      'Zkdsjqs3o62En4YjlHWxgeGmkiRqGfZ3sJ3u5WZ2xwapdZY3/2T/oOV5ri8SktTv\r\n' +
      'mVGCyhwFuJC/NbJMEwIDAQAB\r\n' +
      '-----END PUBLIC KEY-----';
    var testPrivateKeyPem = '-----BEGIN RSA PRIVATE KEY-----\r\n' +
      'MIICWwIBAAKBgQC4R1AmYYyE47FMZgo708NhFU+t+VWn133PYGt/WYmD5BnKj679\r\n' +
      'YiUmyrC3hX6oZfo4eVpOkycxZvGgXCLQGuDp45XfZkdsjqs3o62En4YjlHWxgeGm\r\n' +
      'kiRqGfZ3sJ3u5WZ2xwapdZY3/2T/oOV5ri8SktTvmVGCyhwFuJC/NbJMEwIDAQAB\r\n' +
      'AoGAZXNdPMQXiFGSGm1S1P0QYzJIW48ZCP4p1TFP/RxeCK5bRJk1zWlq6qBMCb0E\r\n' +
      'rdD2oICupvN8cEYsYAxZXhhuGWZ60vggbqTTa+4LXB+SGCbKMX711ZoQHdY7rnaF\r\n' +
      'b/Udf4wTLD1yAslx1TrHkV56OfuJcEdWC7JWqyNXQoxedwECQQDZvcEmBT/Sol/S\r\n' +
      'AT5ZSsgXm6xCrEl4K26Vyw3M5UShRSlgk12gfqqSpdeP5Z7jdV/t5+vD89OJVfaa\r\n' +
      'Tw4h9BibAkEA2Khe03oYQzqP1V4YyV3QeC4yl5fCBr8HRyOMC4qHHKQqBp2VDUyu\r\n' +
      'RBJhTqqf1ErzUBkXseawNxtyuPmPrMSl6QJAQOgfu4W1EMT2a1OTkmqIWwE8yGMz\r\n' +
      'Q28u99gftQRjAO/s9az4K++WSUDGkU6RnpxOjEymKzNzy2ykpjsKq3RoIQJAA+XL\r\n' +
      'huxsYVE9Yy5FLeI1LORP3rBJOkvXeq0mCNMeKSK+6s2M7+dQP0NBYuPo6i3LAMbi\r\n' +
      'yT2IMAWbY76Bmi8TeQJAfdLJGwiDNIhTVYHxvDz79ANzgRAd1kPKPddJZ/w7Gfhm\r\n' +
      '8Mezti8HCizDxPb+H8HlJMSkfoHx1veWkdLaPWRFrA==\r\n' +
      '-----END RSA PRIVATE KEY-----';
    var testPublicKey = {
      '@context': 'https://w3id.org/security/v1',
      id: testPublicKeyUrl,
      type: 'CryptographicKey',
      owner: 'https://example.com/i/alice',
      publicKeyPem: testPublicKeyPem
    };
    var testPublicKeyOwner = {
      '@context': 'https://w3id.org/security/v1',
      id: 'https://example.com/i/alice',
      publicKey: [testPublicKey]
    };

    var obj = as.object().name('foo').get();

    var options = {
      sign: {
        privateKeyPem:testPrivateKeyPem,
        creator:testPublicKeyUrl
      }
    };

    obj.prettyWrite(options, (err,doc)=> {
      assert.equal(err, undefined);
      as.verify(doc, {
        publicKey: testPublicKey,
        publicKeyOwner: testPublicKeyOwner,
      }, (err,verified)=> {
        assert.equal(err, undefined);
        assert(verified);
        done();
      });
    });

  });
});
