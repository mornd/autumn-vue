import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2fzJy+UblRx+JYRPspKC\n' +
'2Xw0IyUrAvjnwpQEqMARlDXQKOrlyNgF47ZdzZqApZWeiItkjtuQIq8Zrf0c+A6N\n' +
'nt8Ao35qvoOJTAeg3wit4+WdavSwHjYNWPTltqgeFuap8+L8qLHe312G0nWdEo1Z\n' +
'I7/2S2uiAPk7NCff3zmOQGRATM/yrlY+ksSv9mj32T14IDAJTi4ImZS+kNtCLEoI\n' +
'dycKHjTy+68rfuctmnpl5cTJdEbxcTggf09DH1ur19oMmBnTuyzSbm15kbfMiAEm\n' +
'1etFo1TdV4Czv1WwIlmQbtWGY7MPHQjsMk5wc41lYXrGiApLnpnglSCsnt/pANZE\n' +
'VwIDAQAB'

const privateKey = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDZ/MnL5RuVHH4l\n' +
    'hE+ykoLZfDQjJSsC+OfClASowBGUNdAo6uXI2AXjtl3NmoCllZ6Ii2SO25Airxmt\n' +
    '/Rz4Do2e3wCjfmq+g4lMB6DfCK3j5Z1q9LAeNg1Y9OW2qB4W5qnz4vyosd7fXYbS\n' +
    'dZ0SjVkjv/ZLa6IA+Ts0J9/fOY5AZEBMz/KuVj6SxK/2aPfZPXggMAlOLgiZlL6Q\n' +
    '20IsSgh3JwoeNPL7ryt+5y2aemXlxMl0RvFxOCB/T0MfW6vX2gyYGdO7LNJubXmR\n' +
    't8yIASbV60WjVN1XgLO/VbAiWZBu1YZjsw8dCOwyTnBzjWVhesaICkuemeCVIKye\n' +
    '3+kA1kRXAgMBAAECggEAIEYb/nMaRVZlmtpfDlpAw0BvW7C6EIOXlKhjlDRzpdTd\n' +
    'z+EPSlApdxBeDP3OBDYFtcOljL0XNvtjuu3ZpyRIdXgg2RPza+d/oWETwVHApRgu\n' +
    '2VIG7UIlccE4bXWwlsVp7jDyJWvISpvHRUuiiMeipfda2MnDv48m487vh1Y3KHMp\n' +
    'VvBfAaxv49gi7FoLUkF7OWv0DbxaaA6R2D3E//JMYUIWpRmjiVftboy7LfLLGeiM\n' +
    'f8Uo9a6hdrOjNif1ePSYG89mEwXDwHIAoj7wX0n2m/8Z3U1f81lgea2r3zhBDZ3G\n' +
    'l0ps+/CaVflaRo7XfXD5e6ceomi8BpZW3Z4U1xnV6QKBgQDxDNPPqSqSlXo0/PAZ\n' +
    'dv4X7m0bYlMgGWQaj8z4h4WAk1klssfYs1Q9Hgt9wa0kJWCXCF2ts43xYL/Rw+Tu\n' +
    '+IYAmk1ThM+J+OEwhvEzdBqiDXYfUsa1Z0AvNtYkGx47coi5NcBNVHfp70Ab/RdU\n' +
    'sTgBqCAttY6vf8CuzGkF66vmzQKBgQDngcsQk67c0WoRUlv8vk4cjKXymXLLd8z3\n' +
    'TVdI4tBlE0GIu07nLZcJ9ocpOEjjmKq8Zjio89dSkfWg9W8YqcSSOG+o9sH+w6Zg\n' +
    'aVHID5dRXMs3dA+xWf0jfi2qB34FwlA500s2wjgJPQW46E2k7jJ+C2e4tx3BGmDS\n' +
    '5axNPtVvswKBgGjzQs1pRAXqWvjzH76Wlm7o+kwv9S1GoNUHwyB6MOAYR3ooauao\n' +
    'vYaWrD4mszHHrFRV6iOUx7pOe3XjKqv5PK7Kf9xbONlDqRgtyJq0dFwWLFXa/nVA\n' +
    '7SshXv79Z55OccTh6EZC/qq15l3JRf0z48Sk5M3B/MvgfY4dpaRURdYJAoGAbQz3\n' +
    'sZRPf1bp5sTr7c9bDhm2peNgbrW9CBUXc47b6XC7owPQdBdGmXvWSTVpKESm0F46\n' +
    'fGN4Xz2//ZT/QxfdL5+EAYxS74YL3kheLKYjekECvNlf9wPTuR9btUcYNvBESCje\n' +
    'uimcqcVj56kNwg4uHK+UqS8gxfB+AXoMwspBUf8CgYB1ZEnC/tAFtvKbw4RHZYB5\n' +
    'eE++6jdW3H3PzVRp20z9viJehElxMqq0qfAgx30kBgUOAB6NDgvtiGlUQMOUP/+I\n' +
    'UnUFirypNPZgiD78n1H9lmGExCzzN4/c6gV7mcwrSNKLszA/H6Qk7Edxg6uQSGwV\n' +
    'Mtin87+tgpcfRvQIb8/tEw=='

// 加密
export function encryptContent(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decryptContent(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

