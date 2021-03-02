describe('Extensions...', () => {
    it('should create a signed entry and verify it', (done) => {
  
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
          privateKeyPem: testPrivateKeyPem,
          creator: testPublicKeyUrl
        }
      };
  
      obj.prettyWrite(options, (err, doc) => {
        assert.equal(err, undefined);
        as.verify(doc, {
          publicKey: testPublicKey,
          publicKeyOwner: testPublicKeyOwner,
        }, (err, verified) => {
          assert.equal(err, undefined);
          assert(verified);
          done();
        });
      });
  
    });
  })
