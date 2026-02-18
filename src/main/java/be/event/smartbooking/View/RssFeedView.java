package be.event.smartbooking.view;

import be.event.smartbooking.model.Show;
import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Content;
import com.rometools.rome.feed.rss.Item;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.feed.AbstractRssFeedView;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class RssFeedView extends AbstractRssFeedView {

    // URL de ton front React (valeur par défaut si non définie dans properties)
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    protected void buildFeedMetadata(Map<String, Object> model, Channel feed, HttpServletRequest request) {
        feed.setTitle("SmartBooking - Spectacles");
        feed.setDescription("Les derniers spectacles disponibles à la réservation.");
        feed.setLink(frontendUrl);
        feed.setLanguage("fr-be");
    }

    @Override
    protected List<Item> buildFeedItems(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) {
        @SuppressWarnings("unchecked")
        List<Show> shows = (List<Show>) model.get("shows");
        List<Item> items = new ArrayList<>();

        for (Show show : shows) {
            Item item = new Item();

            // 1. Titre
            item.setTitle(show.getTitle());

            // 2. Lien vers la page détail React
            String showUrl = frontendUrl + "/show/" + show.getSlug();
            item.setLink(showUrl);
            item.setGuid(new com.rometools.rome.feed.rss.Guid(showUrl));

            // 3. Date (Conversion LocalDateTime -> Date avec fuseau horaire système pour éviter le bug)
            if (show.getCreatedAt() != null) {
                Date pubDate = Date.from(show.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant());
                item.setPubDate(pubDate);
            }

            // 4. Description
            Content content = new Content();
            content.setType("text/plain");
            content.setValue(show.getDescription() != null ? show.getDescription() : "Voir les détails sur le site.");
            item.setDescription(content);

            items.add(item);
        }
        return items;
    }
}