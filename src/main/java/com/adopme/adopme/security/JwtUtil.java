package com.adopme.adopme.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private final long expiration = 1800000; // 30mins

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String validateTokenAndRetrieveSubject(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            throw new IllegalArgumentException("Expired JWT token");
        } catch (UnsupportedJwtException e) {
            throw new IllegalArgumentException("Unsupported JWT token");
        } catch (MalformedJwtException e) {
            throw new IllegalArgumentException("Invalid JWT token");
        } catch (Exception e) {
            throw new IllegalArgumentException("JWT token is malformed or invalid");
        }
    }
}