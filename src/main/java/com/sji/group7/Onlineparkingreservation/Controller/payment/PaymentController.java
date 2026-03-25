package com.sji.group7.Onlineparkingreservation.controller.payment;

import com.sji.group7.Onlineparkingreservation.model.User;
import com.sji.group7.Onlineparkingreservation.service.UserService;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${stripe.api.public-key}")
    private String publicKey;

    @Autowired
    private UserService userService;

    @PostMapping("/create-checkout-session/{userId}")
    public Map<String, String> createCheckoutSession(@RequestBody Map<String, Object> data, @PathVariable Integer userId, Model model) throws Exception {
        User user = userService.getUserById(userId);
        model.addAttribute("user", user);

        Long amount = Long.parseLong(data.get("amount").toString());

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8095/payment-success" + "/" + user.getId())
                .setCancelUrl("http://localhost:8095/payment-cancel" + "/" + user.getId())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("xof")
                                                .setUnitAmount(amount) // amount in cents
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Parking reservation")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return Map.of("id", session.getId());
    }

    @GetMapping("/public-key")
    public Map<String, String> getPublicKey() {
        Map<String, String> map = new HashMap<>();
        map.put("publicKey", publicKey);
        return map;
    }
}
