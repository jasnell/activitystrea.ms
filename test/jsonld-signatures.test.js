const assert = require('assert');
const as = require('../src/activitystreams');
const jsigs = require('jsonld-signatures');
const { purposes: { AssertionProofPurpose } } = jsigs;

describe('Extensions...', () => {
  it('should create a signed entry and verify it', async () => {

    const { CryptoLD } = await import('crypto-ld');
    const { Ed25519Signature2020 } = await import('@digitalbazaar/ed25519-signature-2020');
    const { Ed25519VerificationKey2020  } = await import('@digitalbazaar/ed25519-verification-key-2020');
    const { X25519KeyAgreementKey2020 } = await import('@digitalbazaar/x25519-key-agreement-key-2020');

    const cryptoLd = new CryptoLD();

    cryptoLd.use(Ed25519VerificationKey2020);
    cryptoLd.use(X25519KeyAgreementKey2020);

    const keyPair = await cryptoLd.generate({ type: 'Ed25519VerificationKey2020' });

    const suite = new Ed25519Signature2020({ key: keyPair });
    suite.date = '2010-01-01T19:23:24Z';


    var obj = as.object().name('foo').get();

    var options = {
      sign: {
        suite,
        purpose: new AssertionProofPurpose()
      }
    };

    const doc = await obj.prettyWrite(options);

    const verified = await as.verify(doc, {
      ...keyPair,
      suite,
      purpose: new AssertionProofPurpose()
    });
    
    assert(verified);
  });
})
